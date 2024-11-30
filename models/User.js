//models users , para la vista de user home
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    fechaDeNacimiento: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
