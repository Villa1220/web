require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importar el paquete cors
const connectDB = require('./config/database');

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/menu', menuRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
