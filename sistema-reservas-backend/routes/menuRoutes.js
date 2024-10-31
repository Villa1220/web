const express = require('express');
const { 
    getAllMenuItems, 
    getMenuItemById, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    uploadImage 
} = require('../controllers/menuController');

const router = express.Router();

// Rutas
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', uploadImage, createMenuItem); // Carga de imagen al crear
router.put('/:id', uploadImage, updateMenuItem); // Carga de imagen al actualizar
router.delete('/:id', deleteMenuItem);

module.exports = router;
