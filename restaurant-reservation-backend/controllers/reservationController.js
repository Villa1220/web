const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
  try {
    const { user, date, time, guests, menuItems } = req.body;
    const reservation = new Reservation({ user, date, time, guests, menuItems });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.params.userId }).populate('menuItems');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas del usuario' });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user').populate('menuItems');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todas las reservas' });
  }
};
