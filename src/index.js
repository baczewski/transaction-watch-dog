import 'dotenv/config';
import config from './config/config.js';
import logger from './utils/logger.js';
import container from './container.js';
import sequelize from './config/database.js';

// TODO: Load all models dynamically
import Rule from './infrastructure/database/models/rule.js';

try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    await sequelize.sync({ alter: true }); 
} catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
}

// const matcher = container.resolve('TransactionMatcher');
// const matchingRule = await matcher.matchTransaction({ id: 1, value: '100000000000000000000', description: 'Test transaction' });
// console.log(matchingRule);

config.validate({ allowed: 'strict' });

const server = container.resolve('server');
server.start(config.get('port'));

// logger.info('Hello World!');
// logger.info(JSON.stringify(config.get('db')));

