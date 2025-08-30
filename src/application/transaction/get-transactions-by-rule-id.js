import BaseEvent from "../base-event.js";

class GetTransactionsByRuleId extends BaseEvent {
    constructor({ transactionRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR',
        });
        this.transactionRepository = transactionRepository;
    }

    async execute(ruleId) {
        const { SUCCESS, ERROR } = this.events;
        
        try {
            const transactions = await this.transactionRepository.getAllByRuleId(ruleId);
            this.emit(SUCCESS, transactions);
        } catch (error) {
            this.emit(ERROR, error);
        }
    }
}

export default GetTransactionsByRuleId;