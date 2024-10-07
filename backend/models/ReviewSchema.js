const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: String, required: true }, // Assuming you're using Auth0 userId
  username: { type: String, required: true }, // To store the reviewer's name
  rating: { type: Number, required: true }, // Rating out of 5
  comment: { type: String, required: true }, // User's review comment
}, {
  timestamps: true // To add createdAt and updatedAt automatically
});

module.exports = mongoose.model('Review', reviewSchema);
