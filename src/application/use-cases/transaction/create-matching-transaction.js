import BaseUseCase from "../../shared/base-use-case.js";
import { ValidationError } from "../../errors/validation-error.js";
import { createTransactionSchema } from "../../validation/transaction.js";

class CreateMatchingTransaction extends BaseUseCase {
    constructor({ logger, transactionRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR',
            VALIDATION_ERROR: 'VALIDATION_ERROR'
        });
        this.logger = logger;
        this.transactionRepository = transactionRepository;
    }

    async execute(transaction, rule) {
        const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

        const transactionData = {
            hash: transaction.hash,
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            blockNumber: transaction.blockNumber,
            ruleId: rule.id,
        };

        try {
            const validatedData = await createTransactionSchema.validate(transactionData, {
                abortEarly: false,
                stripUnknown: true
            });

            const createdTransaction = await this.transactionRepository.create(validatedData);
            this.emit(SUCCESS, createdTransaction);
        } catch (error) {
            if (error.name === 'ValidationError') {
                this.emit(VALIDATION_ERROR, ValidationError.fromYupError(error));
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default CreateMatchingTransaction;