const express = require('express');
const router = express.Router();
const ReservationDetail = require('../models/ReservationDetail');

// Crear un detalle de reserva
router.post('/', async (req, res) => {
    try {
        const reservationDetail = new ReservationDetail(req.body);
        await reservationDetail.save();
        res.status(201).json(reservationDetail);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear detalle de reserva.' });
    }
});

// Actualizar un detalle de reserva
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const reservationDetail = await ReservationDetail.findByIdAndUpdate(id, updates, { new: true });
        if (!reservationDetail) return res.status(404).json({ message: 'Detalle de reserva no encontrado' });
        res.json(reservationDetail);
    } catch (error) {
        console.error('Error al modificar el detalle de la reserva:', error);
        res.status(500).json({ message: 'Error al modificar el detalle de la reserva', error: error.message });
    }
});

module.exports = router;
