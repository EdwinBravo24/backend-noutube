// controllers middlewares.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Guardamos el userId en el objeto de la solicitud
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido.' });
    }
};

module.exports = {
    authMiddleware
};
