import BaseEvent from "../base-event.js";

class CreateRuleEvent extends BaseEvent {
    constructor({ ruleRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            VALIDATION_ERROR: 'VALIDATION_ERROR',
            ERROR: 'ERROR',
        });
        this.ruleRepository = ruleRepository;
    }

    async execute(ruleData) {
        const { SUCCESS, VALIDATION_ERROR, ERROR } = this.events;
        
        try {
            // TODO: Handle validation error thrown from rule repository
            const newRule = await this.ruleRepository.create(ruleData);
            this.emit(SUCCESS, newRule);
        } catch (error) {
            if (error.message.startsWith('Validation failed:')) {
                this.emit(VALIDATION_ERROR, error.message);
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default CreateRuleEvent;