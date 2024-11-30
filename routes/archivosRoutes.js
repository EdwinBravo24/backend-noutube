// rutas archivosRoutes.js
const express = require('express');
const {subirArchivo,obtenerArchivosPorUsuario,obtenerArchivosGenerales, upload,eliminarArchivo} = require('../controllers/archivosController');
const { authMiddleware } = require('../controllers/middlewares');

const router = express.Router();

// Ruta para subir archivos (requiere autenticación y procesamiento de archivo)
router.post('/subir', authMiddleware, upload, subirArchivo);

// Ruta para obtener los archivos del usuario autenticado
router.get('/muro', authMiddleware, obtenerArchivosPorUsuario);

// Ruta para obtener todos los archivos (muro general)
router.get('/general', authMiddleware, obtenerArchivosGenerales);

router.delete('/eliminar/:id', authMiddleware, eliminarArchivo);

module.exports = router;
