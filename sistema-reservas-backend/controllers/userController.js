const User = require('../models/User');

// Obtener todos los usuarios activos
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({ isActive: true }); // Solo usuarios activos
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  };

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(id, { name, email, address, phone }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

// Eliminar (desactivar) un usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
      const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json({ message: 'Usuario desactivado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al desactivar usuario', error });
    }
  };