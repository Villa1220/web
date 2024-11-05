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

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, getUserReservations);
router.get('/admin', authMiddleware, adminMiddleware, getAllReservations);
router.put('/:id', authMiddleware, updateReservation);
router.delete('/:id', authMiddleware, cancelReservation);

// Admin routes
router.put('/admin/:id/status', adminMiddleware, updateReservationStatus); 
router.delete('/admin/:id', adminMiddleware, deleteReservation); 
router.put('/admin/edit/:id', adminMiddleware, editReservation); 

module.exports = router;
