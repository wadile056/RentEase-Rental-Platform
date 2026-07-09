const Maintenance = require('../models/Maintenance');
const Rental = require('../models/Rental');

// @desc    Raise a new maintenance support ticket
// @route   POST /api/maintenance
// @access  Private
const createTicket = async (req, res, next) => {
  try {
    const { rentalId, issueType, description, scheduledDate } = req.body;

    // Verify that the user actually owns/rents this item before servicing
    const activeRental = await Rental.findOne({ _id: rentalId, user: req.user._id });
    if (!activeRental) {
      res.status(403);
      return next(new Error('Unauthorized: You do not hold an active lease matching this reference'));
    }

    const ticket = new Maintenance({
      rental: rentalId,
      user: req.user._id,
      issueType,
      description,
      scheduledDate: new Date(scheduledDate)
    });

    const registeredTicket = await ticket.save();
    res.status(201).json(registeredTicket);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all maintenance tickets for the logged-in customer
// @route   GET /api/maintenance/my-tickets
// @access  Private
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Maintenance.find({ user: req.user._id })
      .populate({
        path: 'rental',
        populate: { path: 'product', select: 'name category' }
      })
      .sort('-createdAt');
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all global tickets for the central Admin dashboard
// @route   GET /api/maintenance/admin/all
// @access  Private/Admin
const getAllTicketsForAdmin = async (req, res, next) => {
  try {
    const tickets = await Maintenance.find({})
      .populate('user', 'name email phoneNumber')
      .populate({
        path: 'rental',
        populate: { path: 'product', select: 'name' }
      })
      .sort('-createdAt');
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket stage status and attach diagnostic logs
// @route   PUT /api/maintenance/:id
// @access  Private/Admin
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const ticket = await Maintenance.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      return next(new Error('Maintenance ticket ledger reference missing'));
    }

    if (status) ticket.status = status;
    if (adminNotes) ticket.adminNotes = adminNotes;

    const savedTicket = await ticket.save();
    res.json(savedTicket);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTicketsForAdmin,
  updateTicketStatus
};