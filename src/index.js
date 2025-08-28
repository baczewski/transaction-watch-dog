import 'dotenv/config';
import config from './config/config.js';

config.validate({ allowed: 'strict' });

console.log('Hello World!');
console.log(config.get('database'));
