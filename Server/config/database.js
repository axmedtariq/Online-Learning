const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        port: process.env.DB_PORT || 1433,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
            }
        },
        logging: false // Toggle for debugging
    }
);

module.exports = sequelize;
