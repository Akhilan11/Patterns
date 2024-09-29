const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Protecting the routes
const checkJwt = require('../middleware/auth'); // Import the JWT middleware

// Fetch User Profile - PRIVATE ROUTE
router.get('/users/profile', checkJwt, async (req, res) => {
    console.log(req.user); // Log req.user to see if it contains the expected data
    try {
        // Extract Auth0 user ID from the JWT token (req.user is set by checkJwt middleware)
        const { sub } = req.user;

        // Find the user in the database based on their Auth0 ID
        const user = await User.findOne({ auth0Id: sub });

        // If user is not found, return 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user profile
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Profile - PRIVATE ROUTE
router.put('/users/update', checkJwt, async (req, res) => {
    try {
        // Extract the Auth0 user ID from the JWT token (req.user is set by checkJwt middleware)
        const { sub } = req.user;

        // Find the user in the database by their Auth0 ID
        const user = await User.findOne({ auth0Id: sub });

        // If user not found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields from request body
        const updates = req.body; // Example: { name: "New Name", email: "newemail@example.com" }
        Object.assign(user, updates); // Merge new updates into the existing user object

        // Save updated user
        await user.save();

        // Return the updated user profile
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete User by Auth0 ID - PRIVATE ROUTE
router.delete('/users/delete', checkJwt, async (req, res) => {
    try {
        const { sub } = req.user;

        // Find and delete user by Auth0 ID
        const user = await User.findOneAndDelete({ auth0Id: sub });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
