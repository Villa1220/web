const Reservation = require('../models/Reservation');
const ReservationDetail = require('../models/ReservationDetail');
const MenuItem = require('../models/MenuItem');


exports.createReservation = async (req, res) => {
    const { reservationDate, guests, menuItems } = req.body;
    const userId = req.user.userId;

    if (!reservationDate || !guests || !Array.isArray(menuItems) || menuItems.length === 0) {
        return res.status(400).json({ message: 'Datos de reserva incompletos o inválidos.' });
    }

    try {
        const menuItemsInDB = await MenuItem.find({ '_id': { $in: menuItems.map(item => item.item) } });
        if (menuItemsInDB.length !== menuItems.length) {
            return res.status(400).json({ message: 'Uno o más platos no existen.' });
        }

        const reservation = new Reservation({
            user: userId,
            reservationDate,
            guests,
        });

        await reservation.save();

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

exports.getUserReservations = async (req, res) => {
    const userId = req.user.userId;

    try {
        const reservations = await Reservation.find({ user: userId });
        const reservationDetails = await ReservationDetail.find({ reservation: { $in: reservations.map(r => r._id) } })
            .populate({ path: 'menuItem', select: 'name image' });

        res.status(200).json({ reservations, reservationDetails });
    } catch (error) {
        console.error('Error al obtener las reservas del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
};

exports.getAllReservations = async (req, res) => {
    const { startDate, endDate, userId } = req.query;

    // Validación de formato de fecha para startDate y endDate
    const isValidDate = date => !isNaN(Date.parse(date));
    if ((startDate && !isValidDate(startDate)) || (endDate && !isValidDate(endDate))) {
        return res.status(400).json({ message: 'Formato de fecha inválido en startDate o endDate' });
    }

    try {
        let query = {};
        if (startDate || endDate) {
            query.reservationDate = {};
            if (startDate) query.reservationDate.$gte = new Date(startDate);
            if (endDate) query.reservationDate.$lte = new Date(endDate);
        }
        if (userId) {
            query.user = userId;
        }

        const reservations = await Reservation.find(query).populate('user');
        const reservationDetails = await ReservationDetail.find({ reservation: { $in: reservations.map(r => r._id) } })
            .populate('menuItem');

        res.status(200).json({ reservations, reservationDetails });
    } catch (error) {
        console.error('Error al obtener todas las reservas:', error);
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
};


exports.updateReservation = async (req, res) => {
    const { id } = req.params;
    const { reservationDate, guests, menuItems } = req.body;

    try {
        if (!reservationDate || !guests || !Array.isArray(menuItems) || menuItems.length === 0) {
            return res.status(400).json({ message: 'Datos de reserva incompletos o inválidos.' });
        }

        const reservation = await Reservation.findByIdAndUpdate(id, { reservationDate, guests }, { new: true });
        if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });

        await ReservationDetail.deleteMany({ reservation: id });

        const reservationDetails = menuItems.map(item => ({
            reservation: id,
            menuItem: item.item,
            quantity: item.quantity,
        }));
        await ReservationDetail.insertMany(reservationDetails);

        res.status(200).json({ reservation, message: 'Reserva y detalles actualizados exitosamente.' });
    } catch (error) {
        console.error('Error al modificar la reserva:', error);
        res.status(500).json({ message: 'Error al modificar la reserva', error: error.message });
    }
};

exports.cancelReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await Reservation.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
        if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
        
        await ReservationDetail.deleteMany({ reservation: id });

        res.status(200).json({ message: 'Reserva cancelada exitosamente.' });
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
    }
};

exports.updateReservationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
        if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
        res.status(200).json(reservation);
    } catch (error) {
        console.error('Error al actualizar el estado de la reserva:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la reserva', error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
      const reservation = await Reservation.findById(id);
      if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
      if (reservation.status !== 'pending') {
          return res.status(400).json({ message: 'Solo se pueden cancelar reservas pendientes.' });
      }
      reservation.status = 'canceled';
      await reservation.save(); 
      await ReservationDetail.deleteMany({ reservation: id }); 

      res.status(200).json({ message: 'Reserva cancelada exitosamente.' });
  } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
  }
};

exports.editReservation = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const reservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });
        if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });

        if (updates.menuItems) {
            await ReservationDetail.deleteMany({ reservation: id });

            const reservationDetails = updates.menuItems.map(item => ({
                reservation: id,
                menuItem: item.item,
                quantity: item.quantity,
            }));
            await ReservationDetail.insertMany(reservationDetails);
        }

        res.status(200).json({ reservation, message: 'Reserva editada y detalles actualizados exitosamente.' });
    } catch (error) {
        console.error('Error al editar la reserva:', error);
        res.status(500).json({ message: 'Error al editar la reserva', error: error.message });
    }
};
