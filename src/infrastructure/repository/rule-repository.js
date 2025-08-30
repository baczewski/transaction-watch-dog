import { createRuleSchema, updateRuleSchema } from '../../application/validation/rule.js';
import { ValidationError, NotFoundError, ConflictError } from '../../application/errors/index.js';

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

    // TODO: Switch to RuleHead and include currentRule
    async getById(id) {
        try {
            const rule = await this.RuleModel.findByPk(id, { rejectOnEmpty: true });
            return this.RuleTransfomer.toDomain(rule);
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                throw new NotFoundError('Rule', id);    
            }
            throw error;
        }
    }

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
                throw ValidationError.fromYupError(error);
            }
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new ConflictError(`Rule with name '${ruleData.name}' already exists`);
            }
            
            throw error;
        }
    }

    async update(id, updateData) {
        const transaction = await this.RuleModel.sequelize.transaction();

        try {
            const ruleHead = await this.RuleHeadModel.findByPk(id, { 
                transaction, 
                rejectOnEmpty: true,
                include: [{ model: this.RuleModel, as: 'currentRule' }]
            });

            const validatedData = await updateRuleSchema.validate(updateData, {
                abortEarly: false,
                stripUnknown: true
            });

            const newRuleData = {
                name: ruleHead.name,
                version: ruleHead.currentRule.version + 1,
                blockConfirmationDelay: ruleHead.currentRule.blockConfirmationDelay,
                conditions: ruleHead.currentRule.conditions,
                metadata: ruleHead.metadata,
                ...validatedData
            };

            const newRule = await this.RuleModel.create(
                this.RuleTransfomer.toPersistence(newRuleData),
                { transaction }
            );

            await ruleHead.update({
                currentRuleId: newRule.id
            }, { transaction });

            await transaction.commit();
            return this.RuleTransfomer.toDomain(newRule);
        } catch (error) {
            await transaction.rollback();
            
            if (error.name === 'SequelizeEmptyResultError') {
                throw new NotFoundError('Rule', id);    
            }
            if (error.name === 'ValidationError') {
                throw ValidationError.fromYupError(error);
            }
            throw error;
        }
    }

    async deactivate(id) {
        try {
            const ruleHead = await this.RuleHeadModel.findOne({ 
                where: { currentRuleId: id },
                rejectOnEmpty: true 
            });

            await ruleHead.update({ isActive: false });
            return this.RuleTransfomer.toDomain(ruleHead);
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                throw new NotFoundError('Rule', id);    
            }
            throw error;
        }
    }
}

export default RuleRepository;