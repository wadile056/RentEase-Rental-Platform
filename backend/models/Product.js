const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['furniture', 'appliances'], required: true },
  subCategory: { type: String, required: true }, 
  images: [{ type: String, required: true }], 
  monthlyRent: { type: Number, required: true }, 
  securityDeposit: { type: Number, required: true }, 
  tenureOptions: [{ 
    months: { type: Number, required: true }, 
    discountPercentage: { type: Number, default: 0 } 
  }],
  stock: { type: Number, required: true, default: 1 },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);