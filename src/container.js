import { asClass, asFunction, asValue, createContainer } from 'awilix';
import RuleRepository from './infrastructure/repository/rule-repository.js';
import Server from './interfaces/http/server.js';
import { scopePerRequest } from 'awilix-express';
import createRouter from './interfaces/http/router.js';
import RuleModel from './infrastructure/database/models/rule.js';
import RuleHeadModel from './infrastructure/database/models/rule-heads.js';
import RuleTransfomer from './interfaces/http/transformers/rule-transformer.js';
import { errorHandler } from './interfaces/http/handlers/error-handler.js';
import logger from './utils/logger.js'
import TransactionMatcher from './application/services/transaction-matcher.js';
import { GetRulesEvent, CreateRuleEvent, GetRuleEvent, DeactivateRuleEvent, UpdateRuleEvent } from './application/rule/index.js';

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
    TransactionMatcher: asClass(TransactionMatcher).singleton(),
});

container.register({
    containerMiddleware: asValue(scopePerRequest(container)),
});

container.register({
    ruleRepository: asClass(RuleRepository).singleton(),
});

container.register({
    createRule: asClass(CreateRuleEvent),
    getRules: asClass(GetRulesEvent),
    getRule: asClass(GetRuleEvent),
    deactivateRule: asClass(DeactivateRuleEvent),
    updateRule: asClass(UpdateRuleEvent),
});

export default container;