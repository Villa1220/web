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

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', uploadImage, createMenuItem); 
router.put('/:id', uploadImage, updateMenuItem); 
router.delete('/:id', deleteMenuItem);

module.exports = router;
