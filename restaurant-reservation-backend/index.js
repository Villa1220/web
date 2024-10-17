const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const menuRoutes = require('./routes/menu');


dotenv.config();


const app = express();


app.use(cors());

app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));


app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes); 
app.use('/api/menu', menuRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
