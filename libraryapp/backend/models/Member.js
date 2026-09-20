import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
}, { _id: false });

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: addressSchema,
  dateOfBirth: { type: Date },
  joinDate: { type: Date, default: Date.now },
  membershipType: { type: String, enum: ['Standard', 'Premium'], default: 'Standard' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  borrowLimit: { type: Number, default: 5 },
  fine: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);
