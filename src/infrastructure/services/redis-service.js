import Redis from 'ioredis';
import config from '../../config/config.js';

class RedisService {
    constructor({ logger }) {
        this.logger = logger;
        this.client = null;
        this.subscriber = null;
    }

    async connect() {
        try {
            this.client = new Redis(config.get('redis.url'));
            this.subscriber = this.client.duplicate();

            this.client.on('error', (err) => {
                this.logger.error('Redis client error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                this.logger.info('Redis client connected');
                this.isConnected = true;
            });

            this.subscriber.on('error', (err) => {
                this.logger.error('Redis subscriber error:', err);
            });

            this.subscriber.on('connect', () => {
                this.logger.info('Redis subscriber connected');
            });

            this.logger.info('Redis service initialized successfully');
        } catch (error) {
            this.logger.error('Failed to connect to Redis', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
        }
        if (this.subscriber) {
            await this.subscriber.quit();
        }
        this.logger.info('Redis connections closed');
    }

    async set(key, value, ttl = null) {
        if (!this.client) {
            throw new Error('Redis client is not initialized. Call connect() first.');
        }

        const serializedValue = JSON.stringify(value);

        if (ttl) {
            await this.client.setex(key, ttl, serializedValue);
        } else {
            await this.client.set(key, serializedValue);
        }

        this.logger.info(`Set key ${key} in Redis`);
    }

    async get(key) {
        if (!this.client) {
            throw new Error('Redis client is not initialized. Call connect() first.');
        }
        const value = await this.client.get(key);

        try {
            return JSON.parse(value);
        } catch (error) {
            this.logger.error('Failed to parse Redis value', error);
            return null;
        }
    }

    async subscribe(channel, callback) {
        if (!this.subscriber) {
            throw new Error('Redis subscriber is not initialized. Call connect() first.');
        }
        await this.subscriber.subscribe(channel);

        this.subscriber.on('message', (chan, message) => {
            if (chan === channel) {
                const parsedMessage = JSON.parse(message);
                callback(parsedMessage);
            }
        });

        this.logger.info(`Subscribed to Redis channel: ${channel}`);
    }

    async publish(channel, message) {
        if (!this.client) {
            throw new Error('Redis client is not initialized. Call connect() first.');
        }
        await this.client.publish(channel, JSON.stringify(message));
        this.logger.info(`Published message to channel ${channel}`);
    }
}

export default RedisService;