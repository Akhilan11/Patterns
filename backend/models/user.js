const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    password: { 
        type: String, 
        required: true 
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
