const express = require('express');
const router = express.Router();
const Address = require('../models/AddressSchema');

// Add new address
router.post('/addresses', async (req, res) => {
  const { userId, name, addressLine, phoneNumber } = req.body;

  // Check for missing fields
  if (!userId || !name || !addressLine || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const address = new Address({ userId, name, addressLine, phoneNumber });
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error(`Error saving address: ${error.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all addresses for a user
router.get('/addresses/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    console.error(`Error fetching addresses: ${error.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update address
router.put('/addresses/:id', async (req, res) => {
  const { name, addressLine, phoneNumber } = req.body;

  // Check for required fields
  if (!name || !addressLine || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required to update the address.' });
  }

  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { name, addressLine, phoneNumber },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error(`Error updating address: ${error.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete address
router.delete('/addresses/:id', async (req, res) => {
  try {
    const address = await Address.findByIdAndRemove(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    res.status(204).send(); // No content response for successful delete
  } catch (error) {
    console.error(`Error deleting address: ${error.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
