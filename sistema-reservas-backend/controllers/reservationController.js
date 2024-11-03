const Reservation = require('../models/Reservation');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

// Crear una reserva
exports.createReservation = async (req, res) => {
  const { reservationDate, guests, menuItems } = req.body;
  const userId = req.user.userId; // ID del usuario que hace la reserva

  try {
    const reservation = new Reservation({
      user: userId,
      reservationDate,
      guests,
      menuItems,
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva', error });
  }
};

// Ver todas las reservas del usuario
exports.getUserReservations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const reservations = await Reservation.find({ user: userId }).populate('menuItems');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error });
  }
};

// Modificar una reserva
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar la reserva', error });
  }
};

// Cancelar una reserva
exports.cancelReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar la reserva', error });
  }
};

// Administrador: ver todas las reservas
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user menuItems');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error });
  }
};

// Administrador: modificar estado de reserva
exports.updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la reserva', error });
  }
};

// Eliminar una reserva
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la reserva', error });
  }
};

// Editar una reserva (si el administrador quiere cambiar cualquier propiedad)
exports.editReservation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar la reserva', error });
  }
};
