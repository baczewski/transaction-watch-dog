import 'dotenv/config';
import config from './config/config.js';
import container from './container.js';

const server = container.resolve('server');
server.start(config.get('port'));
