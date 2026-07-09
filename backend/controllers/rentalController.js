const Rental = require('../models/Rental');
const Product = require('../models/Product');

// @desc    Create a new rental contract (Checkout)
// @route   POST /api/rentals
// @access  Private (Authenticated Users)
const createRental = async (req, res, next) => {
  try {
    const { productId, tenureMonths, startDate, deliveryAddress } = req.body;

    // 1. Fetch targeted product profile
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found in system catalogs'));
    }

    // 2. Validate real-time stock balance
    if (product.stock < 1 || !product.isAvailable) {
      res.status(400);
      return next(new Error('Item out of stock or currently unavailable'));
    }

    // 3. Compute structural lease expiration target date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + Number(tenureMonths));

    // 4. Generate transaction record with historical pricing snapshots
    const rental = new Rental({
      user: req.user._id,
      product: productId,
      tenureMonths,
      startDate: start,
      endDate: end,
      rentPerMonthSnapshot: product.monthlyRent,
      securityDepositPaid: product.securityDeposit,
      deliveryAddress
    });

    // 5. Atomic decrement of inventory stock
    product.stock -= 1;
    if (product.stock === 0) {
      product.isAvailable = false;
    }
    
    await product.save();
    const finalizedRental = await rental.save();

    res.status(201).json(finalizedRental);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current active rentals for the logged-in user
// @route   GET /api/rentals/my-rentals
// @access  Private
const getMyRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('product', 'name images category')
      .sort('-createdAt');
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform rentals with analytical dashboard counters
// @route   GET /api/rentals/admin/all
// @access  Private/Admin
const getAllRentalsForAdmin = async (req, res, next) => {
  try {
    const rentals = await Rental.find({})
      .populate('user', 'name email phoneNumber')
      .populate('product', 'name category monthlyRent')
      .sort('-createdAt');
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery, return or cancellation progress tracking statuses
// @route   PUT /api/rentals/:id/status
// @access  Private/Admin
const updateRentalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      res.status(404);
      return next(new Error('Target subscription order profile not found'));
    }

    rental.status = status;

    // Return item stock if order gets completely returned or cancelled
    if (status === 'returned' || status === 'cancelled') {
      const product = await Product.findById(rental.product);
      if (product) {
        product.stock += 1;
        product.isAvailable = true;
        await product.save();
      }
    }

    const updatedRental = await rental.save();
    res.json(updatedRental);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getAllRentalsForAdmin,
  updateRentalStatus
};