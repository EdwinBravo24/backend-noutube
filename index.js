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
app.use(cors({
    origin: [
        'https://frontend-noutube.vercel.app', // Asegúrate de que este sea el dominio correcto de tu frontend en Vercel
        'http://localhost:4000', // Para desarrollo local, si es necesario
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Asegúrate de que los métodos necesarios estén permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Asegúrate de que los headers que usas estén permitidos
    credentials: true // Si estás utilizando cookies o autenticación basada en sesiones
}));
// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Ruta de prueba
app.get('/test', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Rutas
app.use('/v1/users', userRoutes);
app.use('/v1/archivos', archivosRoutes); // Rutas de archivos

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
