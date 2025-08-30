import 'dotenv/config';
import config from './config/config.js';
import logger from './utils/logger.js';
import container from './container.js';
import sequelize from './config/database.js';

// TODO: Load all models dynamically
import Rule from './infrastructure/database/models/rule.js';
import RuleHead from './infrastructure/database/models/rule-heads.js';
import Transaction from './infrastructure/database/models/transaction.js';

import { defineAssociations } from './infrastructure/database/models/associations.js';
defineAssociations();

// try {
//     await sequelize.authenticate();
//     logger.info('Database connection has been established successfully.');
//     await sequelize.sync({ alter: true }); 
// } catch (error) {
//     logger.error('Unable to connect to the database:', error);
//     process.exit(1);
// }

const redisService = container.resolve('redisService');
await redisService.connect();
const ruleCacheService = container.resolve('ruleCacheService');
await ruleCacheService.initialize();

// await ruleCacheService.notifyRuleUpdate(123123, 'create');
// await ruleCacheService.getCachedRules().then(rules => {
//     console.log('Cached Rules:', rules);
// });

const watchDog = container.resolve('watchDog');
watchDog.start();

// // const matcher = container.resolve('TransactionMatcher');
// // const matchingRule = await matcher.matchTransaction({ id: 1, value: '100000000000000000000', description: 'Test transaction' });
// // console.log(matchingRule);

config.validate({ allowed: 'strict' });

// const server = container.resolve('server');
// server.start(config.get('port'));

// // logger.info('Hello World!');
// // logger.info(JSON.stringify(config.get('db')));

