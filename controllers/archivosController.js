// controlador archivosController
const Archivo = require('../models/archivos');
const Usuario = require('../models/User.js');
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

// Configuración de AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Configuración de Multer (middleware para subir archivos)
const storage = multer.memoryStorage(); // Archivos se almacenan temporalmente en memoria
const upload = multer({ storage }).single('archivo'); // Solo un archivo llamado 'archivo'

// Subir archivo a S3 y guardar referencia en MongoDB
const subirArchivo = async (req, res) => {
    const usuarioId = req.userId; // Extraer ID del usuario autenticado desde el middleware de auth
    const { titulo } = req.body; // Obtener el título del cuerpo de la solicitud

    try {
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({ mensaje: 'El título es obligatorio.' });
        }

        const archivo = req.file; // Obtener archivo del request
        if (!archivo) {
            return res.status(400).json({ mensaje: 'No se ha proporcionado ningún archivo.' });
        }

        // Crear nombre único para el archivo en S3
        const nombreEnS3 = `${Date.now()}-${path.basename(archivo.originalname)}`;

        // Configuración para subir a S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: nombreEnS3,
            Body: archivo.buffer,
            ContentType: archivo.mimetype,
        };

        // Subir a S3
        const result = await s3.upload(params).promise();

        // Guardar referencia en MongoDB con el título
        const nuevoArchivo = new Archivo({
            nombreOriginal: archivo.originalname,
            nombreEnS3,
            url: result.Location,
            usuario: usuarioId,
            titulo, // Guardar el título proporcionado
        });

        await nuevoArchivo.save();

        res.status(201).json({
            mensaje: 'Archivo subido exitosamente.',
            archivo: nuevoArchivo,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al subir el archivo.', error });
    }
};

// Obtener archivos del usuario autenticado
const obtenerArchivosPorUsuario = async (req, res) => {
    try {
        const usuarioId = req.userId; // Obtener ID del usuario autenticado
        const archivos = await Archivo.find({ usuario: usuarioId }); // Buscar archivos por usuario

        res.status(200).json({ archivos });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los archivos.', error });
    }
};

// Obtener todos los archivos (muro general)
// Obtener todos los archivos (muro general)
const obtenerArchivosGenerales = async ( req, res) => {
    try {
        console.log("Iniciando obtención de archivos generales");
        const archivos = await Archivo.find()
            .populate('usuario', 'nombre') // Asegúrate de que el nombre del modelo esté correctamente referenciado
            .exec();

        if (!archivos.length) {
            return res.status(404).json({ mensaje: 'No hay archivos disponibles.' });
        }

        console.log("Archivos obtenidos:", archivos);
        res.status(200).json({ archivos });
    } catch (error) {
        console.error("Error al obtener los archivos generales:", error);
        res.status(500).json({ mensaje: 'Error al obtener los archivos generales.', error });
    }
};



// Eliminar archivo de S3 y de MongoDB
const eliminarArchivo = async (req, res) => {
    const archivoId = req.params.id; // ID del archivo a eliminar
    const usuarioId = req.userId;   // ID del usuario autenticado

    try {
        // Buscar el archivo en la base de datos
        const archivo = await Archivo.findById(archivoId);
        if (!archivo) {
            return res.status(404).json({ mensaje: 'Archivo no encontrado.' });
        }

        // Verificar que el archivo pertenece al usuario autenticado
        if (archivo.usuario.toString() !== usuarioId) {
            return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este archivo.' });
        }

        // Configuración para eliminar de S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: archivo.nombreEnS3, // Key del archivo en S3
        };

        // Eliminar archivo de S3
        await s3.deleteObject(params).promise();

        // Eliminar referencia del archivo en MongoDB
        await archivo.deleteOne();

        res.status(200).json({ mensaje: 'Archivo eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el archivo.', error });
    }
};

module.exports = {
    subirArchivo,
    obtenerArchivosPorUsuario,
    obtenerArchivosGenerales,
    eliminarArchivo,
    upload // Middleware para las rutas
};
