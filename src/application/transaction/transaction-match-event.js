import BaseEvent from "../base-event.js";

class TransactionMatchEvent extends BaseEvent {
    constructor({ logger }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR'
        });
        this.logger = logger;
    }

    async execute(transaction, rule) {
        const { SUCCESS, ERROR } = this.events;

        try {
            this.logger.info('Processing transaction match');

            // TODO: Persist the match to the database or trigger further actions
            this.emit(SUCCESS, { transaction, rule });
        } catch (error) {
            this.logger.error('Error processing transaction match', error);
            this.emit(ERROR, error);
        }
    }
}

export default TransactionMatchEvent;