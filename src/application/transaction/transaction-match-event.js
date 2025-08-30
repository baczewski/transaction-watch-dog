import BaseEvent from "../base-event.js";
import { ValidationError } from "../errors/validation-error.js";

class TransactionMatchEvent extends BaseEvent {
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
            const createdTransaction = await this.transactionRepository.create(transactionData);
            this.emit(SUCCESS, createdTransaction);
        } catch (error) {
            if (error instanceof ValidationError) {
                this.emit(VALIDATION_ERROR, error);
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default TransactionMatchEvent;