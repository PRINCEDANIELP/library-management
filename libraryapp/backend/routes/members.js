import express from 'express';
import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const existingMember = await Member.findOne({ $or: [{ email: req.body.email }, { memberId: req.body.memberId }] });
    if (existingMember) return res.status(400).json({ message: 'Member ID or Email already exists' });
    
    const newMember = new Member(req.body);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
    
    // If the admin manually sets the fine to 0, mark all unpaid transactions for this member as paid
    if (req.body.fine === 0) {
      await Transaction.updateMany(
        { memberId: req.params.id, isFinePaid: false, fine: { $gt: 0 } },
        { $set: { isFinePaid: true } }
      );
    }
    
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
