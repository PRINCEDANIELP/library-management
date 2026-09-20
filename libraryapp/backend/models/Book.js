import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  description: { type: String },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  pages: { type: Number, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
