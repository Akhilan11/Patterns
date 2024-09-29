const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');
const jwtCheck = require('./middleware/auth');

const productRoutes = require('./controller/product_routes')

// Load environment variables
dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());
app.use(productRoutes)

// Connect Database
connectDB();

// Use the JWT middleware to protect your routes
// app.use(jwtCheck);

// Define a protected route
app.get('/api/protected', (req, res) => {
    res.send('This is a protected route, accessible only to authenticated users!');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});