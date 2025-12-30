import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: Number,
  receipt: String,
  phone: String,
  reference: String,
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    default: 'Success',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
