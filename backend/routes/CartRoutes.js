const express = require('express');
const Cart = require('../models/CartSchema');
const router = express.Router();
const Product = require('../models/ProductSchema'); // Assuming this is your Product model


// Add a product to cart
router.post('/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  try {
    // Find the cart by userId
    let cart = await Cart.findOne({ userId });
    
    // If cart exists, update the existing product or add a new product
    if (cart) {
      const productIndex = cart.products.findIndex(p => p.productId == productId);

      if (productIndex >= 0) {
        // If the product already exists in the cart, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.products.push({ productId, quantity });
      }

      // Save the updated cart
      await cart.save();
      return res.status(200).send(cart);
    }

    // If no cart exists for the user, create a new cart
    const newCart = new Cart({
      userId,
      products: [{ productId, quantity }]
    });
    
    // Save the new cart
    await newCart.save();
    res.status(201).send(newCart);

  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).send({ message: 'Server error, could not add to cart' });
  }
});

// Get cart by userId
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find the cart by userId and populate product details
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }
    
    res.send(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).send({ message: 'Server error, could not fetch cart' });
  }
});


// Update item quantity in the cart
router.put('/cart/:userId/items/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).send('Cart not found');
  
      const productIndex = cart.products.findIndex(p => p.productId == productId);
      if (productIndex < 0) return res.status(404).send('Product not found in cart');
  
      // Update the quantity
      if (quantity < 1) {
        // Optionally remove the item if quantity is less than 1
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = quantity;
      }
  
      await cart.save();
      res.status(200).send(cart);
    } catch (err) {
      res.status(500).send(err);
    }
});
  
// Remove item from the cart
router.delete('/cart/:userId/items/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send('Cart not found');

    const productIndex = cart.products.findIndex(p => p.productId == productId);
    if (productIndex < 0) return res.status(404).send('Product not found in cart');

    // Remove the item from the cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
