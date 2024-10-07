const express = require('express');
const router = express.Router();
const Review = require('../models/ReviewSchema');

// Get all reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
});

// Get a single review by ID
router.get('/review/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review.' });
  }
});

// Add a new review
router.post('/reviews', async (req, res) => {
  const { productId, userId, username, rating, comment } = req.body;

  if (!rating || !comment || !productId || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const review = new Review({ productId, userId, username, rating, comment });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review.' });
  }
});

// Update a review by ID
router.put('/reviews/:id', async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required.' });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Update review details
    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review.' });
  }
});

// Delete a review by ID
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review.' });
  }
});

module.exports = router;
