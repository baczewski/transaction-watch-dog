import { asClass, asFunction, asValue, createContainer } from 'awilix';
import RuleRepository from '../repository/rule-repository.js';
import TransactionRepository from '../repository/transaction-repository.js';
import Server from '../../interfaces/http/server.js';
import { scopePerRequest } from 'awilix-express';
import createRouter from '../../interfaces/http/router.js';
import RuleTransfomer from '../../interfaces/http/transformers/rule-transformer.js';
import TransactionTransformer from '../../interfaces/http/transformers/transaction-transformer.js';
import { errorHandler } from '../../interfaces/http/handlers/error-handler.js';
import logger from '../logging/logger.js'
import TransactionMatcher from '../../application/services/transaction-matcher.js';
import { createBlockchainProviders } from '../config/blockchain.js';
import WatchDog from '../../application/services/watch-dog.js';
import RedisService from '../services/redis-service.js';
import RuleCacheService from '../services/rule-cache-service.js';
import RateLimiterMiddleware from '../../interfaces/http/middleware/rate-limiter.js';
import SwaggerMiddleware from '../../interfaces/http/middleware/swagger.js';

import { CreateMatchingTransaction, GetTransactionsByRuleId } from '../../application/use-cases/transaction/index.js';
import { GetRules, CreateRule, GetRule, DeactivateRule, UpdateRule } from '../../application/use-cases/rule/index.js';
import { RuleModel, RuleHeadModel, TransactionModel } from '../database/models/index.js';

// TODO: inject config

const container = createContainer();

container.register({
    server: asClass(Server).singleton(),
    router: asFunction(createRouter).singleton(),
    logger: asValue(logger),
    errorHandler: asValue(errorHandler),
})

container.register({
    RuleModel: asValue(RuleModel),
    RuleHeadModel: asValue(RuleHeadModel),
    RuleTransfomer: asClass(RuleTransfomer).singleton(),
    TransactionTransformer: asClass(TransactionTransformer).singleton(),
    TransactionMatcher: asClass(TransactionMatcher).singleton(),
    TransactionModel: asValue(TransactionModel),
});

container.register({
    containerMiddleware: asValue(scopePerRequest(container)),
    rateLimiterMiddleware: asClass(RateLimiterMiddleware).singleton(),
    swaggerMiddleware: asClass(SwaggerMiddleware).singleton(),
});

container.register({
    ruleRepository: asClass(RuleRepository).singleton(),
    transactionRepository: asClass(TransactionRepository).singleton(),
    redisService: asClass(RedisService).singleton(),
    ruleCacheService: asClass(RuleCacheService).singleton(),
});

container.register({
    createRule: asClass(CreateRule),
    getRules: asClass(GetRules),
    getRule: asClass(GetRule),
    deactivateRule: asClass(DeactivateRule),
    updateRule: asClass(UpdateRule),
    createMatchingTransaction: asClass(CreateMatchingTransaction),
    getTransactionsByRuleId: asClass(GetTransactionsByRuleId),
});

const { httpProvider, wsProvider } = createBlockchainProviders();

container.register({
    httpProvider: asValue(httpProvider),
    wsProvider: asValue(wsProvider),
    watchDog: asClass(WatchDog).singleton(),
});

export default container;