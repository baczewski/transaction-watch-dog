import winston from 'winston';
import config from '../config/config.js';

const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: config.get('env') === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.label({ label: 'TransactionWatchDog' }),
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
});

if (config.get('env') === 'development') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            logFormat
        )
    }));
}

export default logger;