const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

const productRoutes = require('./routes/ProductRoutes')
const cartRoutes = require('./routes/CartRoutes')
const orderRoutes = require('./routes/OrderRoutes')
const adminProductRoutes = require('./routes/AdminProductRoutes')
const addressRoutes = require('./routes/AddressRoutes')
const reviewRoutes = require('./routes/ReviewRoutes')

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors()); // Use CORS middleware

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Routes
app.use('/api', productRoutes); // Use product routes under /api
app.use('/api', cartRoutes); // Use cart routes under /api
app.use('/api', addressRoutes); // Use address routes under /api
app.use('/api', reviewRoutes); // Use review routes under /api
app.use('/api/orders', orderRoutes); // Use order routes under /api

app.use('/api/admin', adminProductRoutes); // Use product routes under /api


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
