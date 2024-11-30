// models/Archivo.js
const mongoose = require('mongoose');

const archivoSchema = new mongoose.Schema({
    nombreOriginal: { type: String, required: true },
    nombreEnS3: { type: String, required: true },
    url: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    titulo: { type: String, required: true }, // Nuevo campo
}, { timestamps: true });

module.exports = mongoose.model('Archivo', archivoSchema);
