import express from 'express';
import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) return res.status(400).json({ message: 'Book not available' });
    
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.fine > 0) return res.status(400).json({ message: 'Member has outstanding fines' });
    if (member.status !== 'Active') return res.status(400).json({ message: 'Member account is not active' });
    
    const activeBorrows = await Transaction.countDocuments({ memberId, status: 'Borrowed' });
    if (activeBorrows >= member.borrowLimit) return res.status(400).json({ message: 'Borrow limit reached' });

    // Update Book
    book.availableCopies -= 1;
    await book.save();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const transaction = new Transaction({
      transactionId: `TXN${Date.now()}`,
      bookId,
      memberId,
      dueDate,
      ...req.body
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/return', async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn || txn.status === 'Returned') return res.status(400).json({ message: 'Invalid or already returned' });

    const returnDate = new Date();
    let fine = 0;
    let status = 'Returned';

    if (returnDate > txn.dueDate) {
      const diffDays = Math.ceil(Math.abs(returnDate - txn.dueDate) / (1000 * 60 * 60 * 24));
      fine = diffDays * 50;
      status = 'Overdue';
    }

    // Update Transaction
    txn.returnDate = returnDate;
    txn.fine = fine;
    txn.status = status;
    if (req.body.notes) txn.notes = req.body.notes;
    await txn.save();

    // Update Book
    await Book.findByIdAndUpdate(txn.bookId, { $inc: { availableCopies: 1 } });

    // Update Member Fine
    if (fine > 0) {
      await Member.findByIdAndUpdate(txn.memberId, { $inc: { fine: fine } });
    }

    res.json(txn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedTxn = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTxn) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/:id/pay-fine', async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    if (txn.fine <= 0) return res.status(400).json({ message: 'No fine associated with this transaction' });
    if (txn.isFinePaid) return res.status(400).json({ message: 'Fine is already paid' });

    // Mark transaction fine as paid
    txn.isFinePaid = true;
    await txn.save();

    // Deduct fine amount from member's overall balance
    // using Math.max to prevent balance going below 0 just in case
    const member = await Member.findById(txn.memberId);
    if (member) {
      member.fine = Math.max(0, member.fine - txn.fine);
      await member.save();
    }

    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
