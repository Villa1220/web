const express = require('express');
const router = express.Router();
const ReservationDetail = require('../models/ReservationDetail');

router.post('/', async (req, res) => {
  try {
    const reservationDetail = new ReservationDetail(req.body);
    await reservationDetail.save();
    res.status(201).json(reservationDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear detalle de reserva.' });
  }
});

module.exports = router;
