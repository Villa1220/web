const MenuItem = require('../models/MenuItem');

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, available } = req.body;
    const menuItem = new MenuItem({ name, description, price, available });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plato' });
  }
};

exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platos del menú' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plato' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el plato' });
  }
};
