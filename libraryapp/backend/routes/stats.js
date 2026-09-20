import express from 'express';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });
    const borrowedBooks = await Transaction.countDocuments({ status: 'Borrowed' });
    
    const members = await Member.find({}, 'fine');
    const totalFines = members.reduce((sum, m) => sum + (m.fine || 0), 0);

    res.json({
      totalBooks,
      activeMembers,
      borrowedBooks,
      totalFines
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
