const express = require('express');
const { urlencoded, json } = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const archivosRoutes = require('./routes/archivosRoutes'); // Agregado

const app = express();

const PORT = process.env.PORT || 4000;

// Configuración general
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/v1/users', userRoutes);
app.use('/v1/archivos', archivosRoutes); // Rutas de archivos

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
