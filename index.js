const express = require('express');
const { urlencoded, json } = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const archivosRoutes = require('./routes/archivosRoutes');

const app = express();

const PORT = process.env.PORT || 4000;

// Configuración de CORS mejorada
app.use(cors({
  origin: '*', // Permitir todos los orígenes en desarrollo
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

// Middleware de registro para depuración
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.path}`);
  next();
});

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Conexión a MongoDB con opciones de configuración mejoradas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Backend de NoTube funcionando correctamente', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba detallada
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Servidor funcionando correctamente',
    endpoints: {
      users: '/v1/users/login, /v1/users/register',
      files: '/v1/archivos/subir, /v1/archivos/muro, /v1/archivos/general'
    },
    serverTime: new Date().toISOString()
  });
});

// Rutas principales
app.use('/v1/users', userRoutes);
app.use('/v1/archivos', archivosRoutes);

// Middleware de manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada', 
    path: req.path,
    method: req.method
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    message: 'Error interno del servidor', 
    error: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;