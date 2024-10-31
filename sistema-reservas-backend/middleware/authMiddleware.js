// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almacena el usuario decodificado en la solicitud
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar si el usuario es admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado, se requieren privilegios de administrador' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
