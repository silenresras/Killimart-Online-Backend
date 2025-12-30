// models/Order.js or Order.ts
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    county: { type: String, required: true },
    subCounty: { type: String, required: true },
    town: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    shippingFee: { type: Number, required: true },
  },
  paymentMethod: {
    type: String,
    default: "M-Pesa",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
