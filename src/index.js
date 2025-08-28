import 'dotenv/config';
import config from './config/config.js';
import sequelize from './config/database.js';
import logger from './utils/logger.js';

config.validate({ allowed: 'strict' });

try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
} catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
}

logger.info('Hello World!');
logger.info(JSON.stringify(config.get('db')));
