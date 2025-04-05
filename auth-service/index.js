const express = require('express');
const { body, validationResult } = require('express-validator');
const { users, generateToken, authenticateToken } = require('./auth');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Endpoint de login
app.post('/api/login', [
    body('username').notEmpty(),
    body('password').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token });
});

// Endpoint protegido (ejemplo)
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, user ${req.user.id}!` });
});

// Puerto del servidor
const PORT = 5002; // Usamos un puerto diferente
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auth Service corriendo en http://0.0.0.0:${PORT}`);
});