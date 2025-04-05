const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Clave secreta para firmar los tokens (cámbiala por una más segura en producción)
const SECRET_KEY = 'tu_clave_secreta';

// Simulación de una base de datos de usuarios
const users = [
    {
        id: 1,
        username: 'BMACF12',
        password: bcrypt.hashSync('BMACF12', 8) // Contraseña cifrada
    }
];

// Función para generar un token JWT
function generateToken(user) {
    return jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
}

// Middleware para verificar el token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del encabezado

    if (!token) return res.sendStatus(401); // Sin token, acceso denegado

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido
        req.user = user; // Adjunta el usuario al objeto de solicitud
        next();
    });
}

module.exports = { users, generateToken, authenticateToken };