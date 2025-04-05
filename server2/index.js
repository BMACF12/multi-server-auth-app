const express = require('express');
const path = require('path');

const app = express();

// Sirve archivos estáticos desde la carpeta "images"
app.use('/media', express.static(path.join(__dirname, 'images')));

// Ruta de ejemplo
app.get('/media/test', (req, res) => {
    res.json({ message: 'Hello from Server 2!' });
});

// Iniciar el servidor
const PORT = 5001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server 2 corriendo en http://0.0.0.0:${PORT}`);
});