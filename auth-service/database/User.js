const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// Definir el modelo de usuario
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Desactivar timestamps automáticos
});

module.exports = User;