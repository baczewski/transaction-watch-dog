import { createRuleSchema } from '../../application/validation/rule.js';

class RuleRepository {
    constructor({ RuleModel, RuleTransfomer, RuleHeadModel }) {
        this.RuleModel = RuleModel;
        this.RuleHeadModel = RuleHeadModel;
        this.RuleTransfomer = RuleTransfomer;
    }

    async getAll() {
        const ruleHeads = await this.RuleHeadModel.findAll({ 
            where: { isActive: true },
            include: [{ model: this.RuleModel, as: 'currentRule' }]
        });

        return ruleHeads.map(head => this.RuleTransfomer.toDomain(head.currentRule));
    }

    async getById(id) {
        const rule = await this.RuleModel.findByPk(id);
        return rule ? this.RuleTransfomer.toDomain(rule) : null;
    }

    // TODO: Add better validation and error handling
    async create(ruleData) {
        const transaction = await this.RuleModel.sequelize.transaction();

        try {
            const validatedData = await createRuleSchema.validate(ruleData, {
                abortEarly: false,
                stripUnknown: true
            });

            const rule = await this.RuleModel.create(
                this.RuleTransfomer.toPersistence(validatedData),
                { transaction }
            );

            await this.RuleHeadModel.upsert({
                name: validatedData.name,
                currentRuleId: rule.id,
                isActive: true
            }, { transaction });

            await transaction.commit();
            return this.RuleTransfomer.toDomain(rule);
        } catch (error) {
            await transaction.rollback();
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => ({
                    field: err.path,
                    message: err.message
                }));
                throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
            }
            // TODO: Handle unique constraint errors and other DB errors more gracefully
            console.log(error);
            throw error;
        }
    }

    async deactivate(id) {
        const ruleHead = await this.RuleHeadModel.findOne({ 
            where: { currentRuleId: id } 
        });

        if (!ruleHead) {
            return null;
        }
        
        await ruleHead.update({ isActive: false });
        return this.RuleTransfomer.toDomain(ruleHead);
    }
}

export default RuleRepository;