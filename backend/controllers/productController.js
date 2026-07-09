const Product = require('../models/Product');

// @desc    Get all products with optional category and search filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, subCategory, search } = req.query;
    let queryCondition = {};

    // Filter by main catalog branch: furniture or appliances
    if (category) {
      queryCondition.category = category;
    }

    // Filter by specific sub-class (e.g., 'sofa', 'fridge')
    if (subCategory) {
      queryCondition.subCategory = subCategory;
    }

    // Match keywords against names or descriptions using Regex
    if (search) {
      queryCondition.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(queryCondition);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found in system inventory'));
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { 
      name, description, category, subCategory, 
      images, monthlyRent, securityDeposit, tenureOptions, stock 
    } = req.body;

    const product = new Product({
      name,
      description,
      category,
      subCategory,
      images,
      monthlyRent,
      securityDeposit,
      tenureOptions,
      stock
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory details or stock levels
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      return next(new Error('Target product profile not found'));
    }
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct
};