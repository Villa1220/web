const express = require('express');
const {
    createReservation,
    getUserReservations,
    updateReservation,
    cancelReservation,
    getAllReservations,
    updateReservationStatus,
    deleteReservation,
    editReservation
} = require('../controllers/reservationController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, getUserReservations);
router.get('/admin', adminMiddleware, getAllReservations); // Obtener todas las reservas con filtros
router.put('/:id', authMiddleware, updateReservation);
router.delete('/:id', authMiddleware, cancelReservation);

// Admin routes
router.put('/admin/:id/status', adminMiddleware, updateReservationStatus); // Cambiar el estado de la reserva
router.delete('/admin/:id', adminMiddleware, deleteReservation); // Eliminar reserva
router.put('/admin/edit/:id', adminMiddleware, editReservation); // Editar reserva

module.exports = router;
