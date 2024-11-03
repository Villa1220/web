require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const menuRoutes = require('./routes/menuRoutes'); 
const reservationRoutes = require('./routes/reservationRoutes');
const reservationDetailsRoutes = require('./routes/reservationDetails');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reservation-details', reservationDetailsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
