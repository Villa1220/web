const express = require('express');
const { createMenuItem, getAllMenuItems, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const router = express.Router();

router.post('/', createMenuItem);
router.get('/', getAllMenuItems);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
