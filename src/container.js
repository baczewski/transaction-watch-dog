import { asClass, asFunction, asValue, createContainer } from 'awilix';
import RuleRepository from './infrastructure/repository/rule-repository.js';
import TransactionRepository from './infrastructure/repository/transaction-repository.js';
import Server from './interfaces/http/server.js';
import { scopePerRequest } from 'awilix-express';
import createRouter from './interfaces/http/router.js';
import RuleModel from './infrastructure/database/models/rule.js';
import RuleHeadModel from './infrastructure/database/models/rule-heads.js';
import RuleTransfomer from './interfaces/http/transformers/rule-transformer.js';
import TransactionModel from './infrastructure/database/models/transaction.js';
import TransactionTransformer from './interfaces/http/transformers/transaction-transformer.js';
import { errorHandler } from './interfaces/http/handlers/error-handler.js';
import logger from './utils/logger.js'
import TransactionMatcher from './application/services/transaction-matcher.js';
import { GetRulesEvent, CreateRuleEvent, GetRuleEvent, DeactivateRuleEvent, UpdateRuleEvent } from './application/rule/index.js';
import { createBlockchainProviders } from './config/blockchain.js';
import WatchDog from './watch-dog.js';
import TransactionMatchEvent from './application/transaction/transaction-match-event.js';

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
});

container.register({
    ruleRepository: asClass(RuleRepository).singleton(),
    transactionRepository: asClass(TransactionRepository).singleton(),
});

container.register({
    createRule: asClass(CreateRuleEvent),
    getRules: asClass(GetRulesEvent),
    getRule: asClass(GetRuleEvent),
    deactivateRule: asClass(DeactivateRuleEvent),
    updateRule: asClass(UpdateRuleEvent),
    transactionMatch: asClass(TransactionMatchEvent),
});

const { httpProvider, wsProvider } = createBlockchainProviders();

container.register({
    httpProvider: asValue(httpProvider),
    wsProvider: asValue(wsProvider),
    watchDog: asClass(WatchDog).singleton(),
});

export default container;