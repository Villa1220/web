const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateCreated: { type: Date, default: Date.now },
  reservationDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  status: { type: String, enum: ['pending', 'accepted', 'canceled'], default: 'pending' } // Solo visible para el admin
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);
