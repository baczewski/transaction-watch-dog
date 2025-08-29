import { asClass, asFunction, asValue, createContainer } from 'awilix';
import CreateRuleEvent from './application/rule/create-rule-event.js';
import RuleRepository from './infrastructure/repository/rule-repository.js';
import Server from './interfaces/http/server.js';
import { scopePerRequest } from 'awilix-express';
import createRouter from './interfaces/http/router.js';

const container = createContainer();

container.register({
    server: asClass(Server).singleton(),
    router: asFunction(createRouter).singleton(),
})

container.register({
    containerMiddleware: asValue(scopePerRequest(container)),
});

container.register({
    ruleRepository: asClass(RuleRepository).singleton(),
});

container.register({
    createRule: asClass(CreateRuleEvent),
});

export default container;