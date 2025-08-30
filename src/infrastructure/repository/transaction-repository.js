import { ConflictError } from '../../application/errors/conflict-error.js';
import { createTransactionSchema } from '../../application/validation/transaction.js';

class TransactionRepository {
    constructor({ TransactionModel, RuleModel, TransactionTransformer }) {
        this.TransactionModel = TransactionModel;
        this.RuleModel = RuleModel;
        this.TransactionTransformer = TransactionTransformer;
    }

    async getAllByRuleId(ruleId) {
        const transactions = await this.TransactionModel.findAll({
            where: { ruleId },
            include: [{ model: this.RuleModel, as: 'rule' }]
        });

        return transactions.map(tx => this.TransactionTransformer.toDomain(tx));
    }

    async create(transactionData) {
        try {
            const validatedData = await createTransactionSchema.validate(transactionData, {
                abortEarly: false,
                stripUnknown: true
            });

            const transaction = await this.TransactionModel.create(validatedData);
            return this.TransactionTransformer.toDomain(transaction);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new ConflictError(`Transaction with hash '${transactionData.hash}' already exists`);
            }
            throw error;
        }
    }
}

export default TransactionRepository;