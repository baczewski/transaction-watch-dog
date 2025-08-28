import 'dotenv/config';
import config from './config/config.js';
import sequelize from './config/database.js';

config.validate({ allowed: 'strict' });

try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
}

console.log('Hello World!');
console.log(config.get('db'));
