const MenuItem = require('../models/MenuItem');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

exports.uploadImage = upload.single('image'); 

exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener platos', error });
    }
};

exports.getMenuItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) return res.status(404).json({ message: 'Plato no encontrado' });
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener plato', error });
    }
};

exports.createMenuItem = async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; 
    try {
        const menuItem = new MenuItem({ name, description, price, image });
        await menuItem.save();
        res.status(201).json({ message: 'Plato creado exitosamente', menuItem });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear plato', error });
    }
};

exports.updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Cambiado a la URL accesible
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(id, { name, description, price, image }, { new: true });
        if (!menuItem) return res.status(404).json({ message: 'Plato no encontrado' });
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar plato', error });
    }
};

exports.deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) return res.status(404).json({ message: 'Plato no encontrado' });
        res.json({ message: 'Plato eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar plato', error });
    }
};
