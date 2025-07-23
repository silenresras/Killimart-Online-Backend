// controllers/order.controller.js
import Order from '../models/order.model.js';

//  1. Place Order
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    const paymentMethod = 'M-Pesa';

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in the order' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await order.populate('user', 'name email'); 

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

// 2. Get My Orders (For Logged In User)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your orders', error: error.message });
  }
};

//  3. Get All Orders (For Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
  .populate('user', 'name email')
  .populate('items.product') // <- populate product inside items
  .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
  }
};

//  4. Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus, deliveryStatus } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Apply updates if present
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
    }

    await order.save();

    // Build dynamic message
    let updates = [];
    if (paymentStatus) updates.push(`paymentStatus to '${paymentStatus}'`);
    if (deliveryStatus) updates.push(`deliveryStatus to '${deliveryStatus}'`);

    res.json({
      message: `Order status updated: ${updates.join(', ')}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

