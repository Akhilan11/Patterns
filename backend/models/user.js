const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    auth0Id: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    name : { 
        type: String, 
        required: true, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/, // Basic email validation
    },
    role: { 
        type: String, 
        default: 'user' // Default role can be 'user', you can define other roles like 'admin' if needed
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
