const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Server 1' });
});

// Puerto del servidor
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server 1 corriendo en http://0.0.0.0:${PORT}`);
});