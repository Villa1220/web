const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true } // Ruta o URL de la imagen
}, {
  timestamps: true,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
