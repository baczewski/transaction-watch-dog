class RuleRepository {
    constructor({ RuleModel }) {
        this.RuleModel = RuleModel;
    }

    // TODO: Add validation and error handling
    async create(ruleData) {
        const rule = await this.RuleModel.create(ruleData);
        return rule;
    }
}

export default RuleRepository;