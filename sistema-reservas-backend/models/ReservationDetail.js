// models/ReservationDetail.js
const mongoose = require('mongoose');

const reservationDetailSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReservationDetail', reservationDetailSchema);
