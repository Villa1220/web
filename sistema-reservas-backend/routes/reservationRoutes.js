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
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas para el usuario
router.post('/', authMiddleware, createReservation); // Crear reserva
router.get('/', authMiddleware, getUserReservations); // Ver reservas del usuario
router.put('/:id', authMiddleware, updateReservation); // Modificar reserva
router.delete('/:id', authMiddleware, cancelReservation); // Cancelar reserva

// Rutas para administrador
router.get('/admin', authMiddleware, adminMiddleware, getAllReservations); // Ver todas las reservas
router.put('/admin/:id/status', authMiddleware, adminMiddleware, updateReservationStatus); // Modificar estado de reserva
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteReservation); // Eliminar reserva
router.put('/admin/:id', authMiddleware, adminMiddleware, editReservation); // Editar reserva

module.exports = router;
