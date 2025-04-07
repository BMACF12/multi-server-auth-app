const { Sequelize } = require('sequelize');

// Configuración de la conexión a PostgreSQL
const sequelize = new Sequelize('auth_db', 'admin', 'secret', {
    host: 'db', // Nombre del servicio en docker-compose.yml
    dialect: 'postgres'
});

// Verificar la conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a PostgreSQL:', error);
    }
})();

module.exports = sequelize;