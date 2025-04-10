const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./database/user'); // Importa el modelo de usuario

const app = express();
app.use(express.json());

// Clave secreta para firmar tokens
const SECRET_KEY = 'tu_clave_secreta';

// Endpoint para registrar usuarios
app.post('/api/register', [
    body('username').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }

        // Cifrar la contraseña
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Crear el usuario en la base de datos
        await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint de login
app.post('/api/login', [
    body('username').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findOne({ where: { username } });

        console.log('🧾 Usuario encontrado:', user?.username);
        console.log('🔑 Password enviada:', password);
        console.log('🔐 Password guardada (hash):', user?.password);

        if (!user) {
            console.log('❌ Usuario no encontrado');
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        console.log('🧪 ¿Coincide contraseña?:', passwordMatch);

        if (!passwordMatch) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }


        // Generar token JWT
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

const sequelize = require('./database/sequelize'); // Importá la instancia Sequelize

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Modelo sincronizado con la base de datos ✅');

        // Iniciar el servidor después de sincronizar
        const PORT = 5002;
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Auth Service corriendo en http://0.0.0.0:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar modelos:', err);
    });

// Puerto del servidor
//const PORT = 5002;
//app.listen(PORT, "0.0.0.0", () => {
//    console.log(`Auth Service corriendo en http://0.0.0.0:${PORT}`);
//});