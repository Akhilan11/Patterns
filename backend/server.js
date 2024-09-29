const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const jwtCheck = require('./middleware/auth');

const productRoutes = require('./controller/product_routes');
const userRoutes = require('./controller/user_routes'); // Add user routes

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS if needed
// app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Connect to Database
connectDB();

// Use the JWT middleware to protect your routes
// app.use(jwtCheck); // Uncomment this if you want to protect all routes by default
// app.use(handleAuthErrors); // Error handling middleware

// Routes
app.use('/api', productRoutes); // Base route for product routes
app.use('/api', userRoutes); // Base route for user routes

// Define a protected route as an example
app.get('/api/protected', (req, res) => {
    res.send('This is a protected route, accessible only to authenticated users!');
});

// Error handler middleware
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.error('UnauthorizedError:', err);
        return res.status(401).send('Invalid token');
    }
    next(err);
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
