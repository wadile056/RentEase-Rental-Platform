const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  tenureMonths: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Financial Snapshot (Captures exact numbers at checkout time)
  rentPerMonthSnapshot: { type: Number, required: true },
  securityDepositPaid: { type: Number, required: true },
  
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: { 
    type: String, 
    enum: ['ordered', 'delivered', 'return-requested', 'returned', 'cancelled'], 
    default: 'ordered' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Rental', RentalSchema);