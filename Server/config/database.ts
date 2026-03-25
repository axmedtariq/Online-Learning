import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL as string, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

export default sequelize;
