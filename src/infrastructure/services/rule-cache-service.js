class RuleCacheService {
    constructor({ ruleRepository, redisService, logger }) {
        this.redisService = redisService;
        this.logger = logger;
        this.ruleRepository = ruleRepository;
        this.cacheKey = 'rules:active';
        this.channel = 'rules:updated';
        this.cacheTtl = 3600;
    }

    async initialize() {
        await this.redisService.subscribe(this.channel, this.handleRuleUpdate.bind(this));
        await this.refreshCache();
        this.logger.info('Rule cache service initialized');
    }

    async handleRuleUpdate(message) {
        try {
            this.logger.info('Received rule update notification:', message);
            await this.refreshCache();
        } catch (error) {
            this.logger.error('Failed to handle rule update message', error);
        }
    }

    async refreshCache() {
        try {
            const rules = await this.ruleRepository.getAll();
            this.redisService.set(this.cacheKey, JSON.stringify(rules), this.cacheTtl);
        } catch (error) {
            this.logger.error('Failed to refresh rule cache', error);
        }
    }

    async notifyRuleUpdate(ruleId, action) {
        try {
            const message = JSON.stringify({ ruleId, action });
            await this.redisService.publish(this.channel, message);
            this.logger.info(`Published rules update to channel ${this.channel}`);
        } catch (error) {
            this.logger.error('Failed to publish rules update', error);
        }
    }

    async getCachedRules() {
        try {
            const cachedRules = await this.redisService.get(this.cacheKey);
            if (!cachedRules) {
                await this.refreshCache();
                return await this.redisService.get(this.cacheKey);
            }
            return cachedRules ? JSON.parse(cachedRules) : [];
        } catch (error) {
            this.logger.error('Failed to get cached rules', error);
            return await this.ruleRepository.getAll();
        }
    }
}

export default RuleCacheService;