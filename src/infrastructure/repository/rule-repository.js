class RuleRepository {
    // TODO: Inject RuleModel as dependency
    constructor() {
        this.rules = new Map();
        this.currentId = 1;
    }

    // TODO: Add validation and error handling
    // TODO: Persist rules in a database
    async create(ruleData) {
        const id = this.currentId++;
        const newRule = { id, ...ruleData };
        this.rules.set(id, newRule);
        return newRule;
    }
}

export default RuleRepository;