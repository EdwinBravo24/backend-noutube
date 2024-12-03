const express = require('express');
const { urlencoded } = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const archivosRoutes = require('./routes/archivosRoutes'); // Rutas de archivos

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS
const corsOptions = {
  origin: ['https://frontend-noutube.vercel.app', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Si usas cookies o tokens con credenciales
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Manejo explícito de preflight OPTIONS

// Configuración general
app.use(express.json());
app.use(urlencoded({ extended: true }));

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
