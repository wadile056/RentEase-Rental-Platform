const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Utility to generate JSON Web Tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new renter/admin
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    // Encrypt password before entry
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user details received'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate User & get token
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password combination'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };