import BaseEvent from "../base-event.js";
import { NotFoundError } from "../errors/not-found-error.js";

class DeactivateRule extends BaseEvent {
    constructor({ ruleRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR',
            NOT_FOUND: 'NOT_FOUND',
        });
        this.ruleRepository = ruleRepository;
    }

    async execute(id) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.events;

        try {
            const rule = await this.ruleRepository.deactivate(id);
            this.emit(SUCCESS, rule);
        } catch (error) {
            if (error instanceof NotFoundError) {
                this.emit(NOT_FOUND, error.message);
                return;
            }
            this.emit(ERROR, error);
        }
        
    }
}

export default DeactivateRule;