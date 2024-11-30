// controlador usuarios y administradores
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    const { nombre, cedula, telefono, ciudad, fechaDeNacimiento, email, pass } = req.body;

    try {
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedPass = await bcrypt.hash(pass, 10);

        const nuevoUsuario = new User({
            nombre,
            cedula,
            telefono,
            ciudad,
            fechaDeNacimiento,
            email,
            pass: hashedPass
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};


const loginUsuario = async (req, res) => {
    const { email, pass } = req.body;

    try {
        let usuario = await User.findOne({ email });
        if (!usuario) {
            usuario = await Admin.findOne({ email });
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }

        const isMatch = await bcrypt.compare(pass, usuario.pass);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { userId: usuario._id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Siempre redirige a '/user/home'
        const redirectUrl = '/user/home';

        res.status(200).json({
            message: 'Login exitoso',
            token,
            role: usuario.role,
            redirectUrl // Este campo se puede quitar si no lo vas a usar en el frontend
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error });
    }
};


module.exports = {
    registrarUsuario,
    loginUsuario
}