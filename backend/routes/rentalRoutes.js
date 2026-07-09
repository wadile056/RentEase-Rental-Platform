const express = require('express');
const router = express.Router();
const {
  createRental,
  getMyRentals,
  getAllRentalsForAdmin,
  updateRentalStatus
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

// User operations
router.post('/', protect, createRental);
router.get('/my-rentals', protect, getMyRentals);

// Admin exclusive monitoring endpoints
router.get('/admin/all', protect, admin, getAllRentalsForAdmin);
router.put('/:id/status', protect, admin, updateRentalStatus);

module.exports = router;