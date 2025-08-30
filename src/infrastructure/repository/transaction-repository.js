import { ValidationError } from '../../application/errors/validation-error.js';
import { createTransactionSchema } from '../../application/validation/transaction.js';

class TransactionRepository {
    constructor({ TransactionModel, RuleModel }) {
        this.TransactionModel = TransactionModel;
        this.RuleModel = RuleModel;
    }

    async getAllByRuleId(ruleId) {
        const transactions = await this.TransactionModel.findAll({
            where: { ruleId },
            include: [{ model: this.RuleModel, as: 'rule' }]
        });

        return transactions;
    }

    async create(transactionData) {
        try {
            const validatedData = await createTransactionSchema.validate(transactionData, {
                abortEarly: false,
                stripUnknown: true
            });

            const transaction = await this.TransactionModel.create(validatedData);
            return transaction;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw ValidationError.fromYupError(error);
            }
            throw error;
        }
    }
}

export default TransactionRepository;