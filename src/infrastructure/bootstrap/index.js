import 'dotenv/config';
import '../database/models/index.js';

import config from '../config/config.js';
import logger from '../logging/logger.js';
import container from '../container/container.js';
import sequelize from '../config/database.js';

import { defineAssociations } from '../database/models/associations.js';
defineAssociations();

try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    await sequelize.sync({ alter: true }); 
} catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
}

const redisService = container.resolve('redisService');
await redisService.connect();

const ruleCacheService = container.resolve('ruleCacheService');
await ruleCacheService.initialize();

const watchDog = container.resolve('watchDog');
watchDog.start();

config.validate({ allowed: 'strict' });

const server = container.resolve('server');
server.start(config.get('port'));