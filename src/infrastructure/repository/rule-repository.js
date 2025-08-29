import { createRuleSchema } from '../../application/validation/rule.js';

class RuleRepository {
    constructor({ RuleModel }) {
        this.RuleModel = RuleModel;
    }

    // TODO: Add better validation and error handling
    async create(ruleData) {
        try {
            const validatedData = await createRuleSchema.validate(ruleData, {
                abortEarly: false,
                stripUnknown: true
            });

            const rule = await this.RuleModel.create(validatedData);
            return rule;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => ({
                    field: err.path,
                    message: err.message
                }));
                throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
            }
            throw error;
        }
    }
}

export default RuleRepository;