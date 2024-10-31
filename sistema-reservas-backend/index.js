require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();
connectDB();

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/menu', menuRoutes);
//comentario
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
