import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['Borrowed', 'Returned', 'Overdue'], default: 'Borrowed' },
  fine: { type: Number, default: 0 },
  isFinePaid: { type: Boolean, default: false },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
