const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { 
    type: String, // Store Auth0 user ID as a string
    required: true 
  },
  name: { type: String, required: true },
  addressLine: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', addressSchema);
