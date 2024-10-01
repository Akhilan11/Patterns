const express = require('express');
const Product = require('../models/ProductSchema'); // Make sure this path is correct
const router = express.Router();

// Create a product - ADMIN ROUTE
router.post('/products', async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: 'Product creation failed', details: error.message });
  }
});

// Get all products (public route)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Get a single product by ID (public route)
router.get('/products/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Update a product by ID - ADMIN ROUTE
router.patch('/products/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: 'Update failed', details: error.message });
  }
});

// Delete a product by ID - PRIVATE ROUTE
router.delete('/products/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(_id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
