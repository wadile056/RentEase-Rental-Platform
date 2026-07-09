const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getAllTicketsForAdmin,
  updateTicketStatus
} = require('../controllers/maintenanceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer interaction layer
router.post('/', protect, createTicket);
router.get('/my-tickets', protect, getMyTickets);

// Central Admin intervention layer
router.get('/admin/all', protect, admin, getAllTicketsForAdmin);
router.put('/:id', protect, admin, updateTicketStatus);

module.exports = router;