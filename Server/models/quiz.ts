const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    passingScore: {
        type: DataTypes.INTEGER,
        defaultValue: 70
    }
}, {
    timestamps: true
});

module.exports = Quiz;
