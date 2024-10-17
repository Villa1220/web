const express = require('express');
const { createReservation, getUserReservations, getAllReservations } = require('../controllers/reservationController');
const router = express.Router();

router.post('/', createReservation);
router.get('/user/:userId', getUserReservations);
router.get('/', getAllReservations);

module.exports = router;
