const MenuItem = require('../models/MenuItem');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Asegúrate de crear esta carpeta
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar archivo
    },
});

const upload = multer({ storage });

// Middleware para la carga de imágenes
exports.uploadImage = upload.single('image'); // 'image' debe coincidir con el nombre del campo en el formulario

// Obtener todos los platos
exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener platos', error });
    }
};

// Obtener un plato por ID
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

// Crear un nuevo plato
exports.createMenuItem = async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : null; // Obtiene la ruta de la imagen cargada
    try {
        const menuItem = new MenuItem({ name, description, price, image });
        await menuItem.save();
        res.status(201).json({ message: 'Plato creado exitosamente', menuItem });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear plato', error });
    }
};

// Actualizar un plato
exports.updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : null; // Obtiene la ruta de la imagen si se carga una nueva
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(id, { name, description, price, image }, { new: true });
        if (!menuItem) return res.status(404).json({ message: 'Plato no encontrado' });
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar plato', error });
    }
};

// Eliminar (desactivar) un plato
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
