// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Registro de usuarios
exports.register = async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, address, phone, role: 'user' });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Genera el token con los datos del usuario
    const token = generateToken(user._id, user.role);

    // Envía la respuesta con token y datos de usuario
    res.json({ 
      token, 
      user: { email: user.email, role: user.role } // Estructura de datos esperada por el frontend
    });
  } catch (error) {
    console.error("Error en el login:", error); // Log para revisar si hay algún problema en el servidor
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

// Registro de administrador
exports.registerAdmin = async (req, res) => {
  const { name, email, password, address, phone, adminKey } = req.body;

  // Verifica la clave de administrador
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Clave de administrador incorrecta" });
  }

  // Verifica si ya existe un administrador con el mismo correo
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Crea el administrador
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new User({
    name,
    email,
    password: hashedPassword,
    address,
    phone,
    role: "admin"
  });

  await newAdmin.save();
  res.status(201).json({ message: "Administrador creado exitosamente" });
};
