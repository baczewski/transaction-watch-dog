import { Sequelize } from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(
    config.get('db.name'),
    config.get('db.user'),
    config.get('db.password'),
    {
        host: config.get('db.host'),
        port: config.get('db.port'),
        dialect: 'postgres',
        logging: config.get('env') === 'development' ? console.log : false,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        },
    }
);

export default sequelize;