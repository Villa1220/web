const Reservation = require('../models/Reservation');
const ReservationDetail = require('../models/ReservationDetail');
const MenuItem = require('../models/MenuItem');

// Crear una reserva
exports.createReservation = async (req, res) => {
  const { reservationDate, guests, menuItems } = req.body;
  const userId = req.user.userId;

  // Validaciones de entrada
  if (!reservationDate || !guests || !Array.isArray(menuItems) || menuItems.length === 0) {
    return res.status(400).json({ message: 'Datos de reserva incompletos o inválidos.' });
  }

  try {
    // Verificar que todos los items del menú existen
    const menuItemsInDB = await MenuItem.find({ '_id': { $in: menuItems.map(item => item.item) } });
    if (menuItemsInDB.length !== menuItems.length) {
      return res.status(400).json({ message: 'Uno o más platos no existen.' });
    }

    // Crear la reserva
    const reservation = new Reservation({
      user: userId,
      reservationDate,
      guests,
    });

    await reservation.save();

    // Crear detalles de la reserva
    const reservationDetails = menuItems.map(item => ({
      reservation: reservation._id,
      menuItem: item.item,
      quantity: item.quantity,
    }));
    await ReservationDetail.insertMany(reservationDetails);

    res.status(201).json({ reservation, reservationDetails });
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
  }
};

// Obtener todas las reservas del usuario
exports.getUserReservations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const reservations = await Reservation.find({ user: userId });
    const reservationDetails = await ReservationDetail.find({ reservation: { $in: reservations.map(r => r._id) } }).populate('menuItem');
    res.json({ reservations, reservationDetails });
  } catch (error) {
    console.error('Error al obtener las reservas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
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
    console.error('Error al modificar la reserva:', error);
    res.status(500).json({ message: 'Error al modificar la reserva', error: error.message });
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
    console.error('Error al cancelar la reserva:', error);
    res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
  }
};

// Administrador: ver todas las reservas
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user');
    const reservationDetails = await ReservationDetail.find({ reservation: { $in: reservations.map(r => r._id) } }).populate('menuItem');
    res.json({ reservations, reservationDetails });
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error);
    res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
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
    console.error('Error al actualizar el estado de la reserva:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la reserva', error: error.message });
  }
};

// Eliminar una reserva
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    await ReservationDetail.deleteMany({ reservation: id }); // Borrar los detalles relacionados
    res.json({ message: 'Reserva eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).json({ message: 'Error al eliminar la reserva', error: error.message });
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
    console.error('Error al editar la reserva:', error);
    res.status(500).json({ message: 'Error al editar la reserva', error: error.message });
  }
};
