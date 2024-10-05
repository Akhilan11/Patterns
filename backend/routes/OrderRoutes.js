const express = require('express');
const router = express.Router();
const Order = require('../models/OrderSchema');
const Product = require('../models/ProductSchema');

// Create a new order
router.post('/create', async (req, res) => {
  const session = await Order.startSession();  // Start a session for atomic transactions
  session.startTransaction();
  
  try {
    const { userId, items, totalPrice, address } = req.body; // Accept address from request

    // Check product availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.quantity < item.quantity) {
        await session.abortTransaction();  // Abort the transaction if product quantity is insufficient
        session.endSession();
        return res.status(400).json({ message: `Insufficient quantity for product: ${product ? product.name : 'Unknown'}` });
      }
    }

    // Deduct the ordered quantity from product inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },  // Decrease product quantity
      }, { session }); // Ensure this update is part of the transaction
    }

    // Create the new order
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      address
    });

    const savedOrder = await newOrder.save({ session });
    await session.commitTransaction();  // Commit the transaction
    session.endSession();

    res.status(201).json(savedOrder);

  } catch (error) {
    await session.abortTransaction();  // Roll back the transaction on error
    session.endSession();
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Get all orders for a user
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get all orders (Admin access)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId'); // Fetch all orders and populate product details
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
});

// Update order status (e.g., marking it as shipped, delivered, or canceled)
router.put('/:orderId', async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    // Find the order to check current status and items
    const order = await Order.findById(orderId).populate('items.productId');

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }

    // If the order is being canceled, restock the items
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId._id, {
          $inc: { quantity: item.quantity },  // Restock the canceled order's items
        }, { session }); // Include session for transaction safety
      }
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updatedOrder);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// Delete an order (if needed)
router.delete('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Fetch the order to restock the products
    const order = await Order.findById(orderId).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Restock the products in the order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { quantity: item.quantity },  // Restock the deleted order's items
      });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted and items restocked' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

module.exports = router;
