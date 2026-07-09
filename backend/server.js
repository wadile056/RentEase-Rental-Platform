const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const dns = require('dns');

dns.setServers(["1.1.1.1","8.8.8.8"]);


dotenv.config();


// Connect to MongoDB Atlas / Local
connectDB();



const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

//  API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));