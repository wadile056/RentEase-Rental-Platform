const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueType: { type: String, required: true }, 
  description: { type: String, required: true },
  scheduledDate: { type: Date, required: true }, 
  status: { 
    type: String, 
    enum: ['raised', 'technician-assigned', 'resolved', 'closed'], 
    default: 'raised' 
  },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);