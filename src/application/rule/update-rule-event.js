import BaseEvent from "../base-event.js";

class UpdateRuleEvent extends BaseEvent {
    constructor({ ruleRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR',
            NOT_FOUND: 'NOT_FOUND',
            VALIDATION_ERROR: 'VALIDATION_ERROR',
        });
        this.ruleRepository = ruleRepository;
    }

    async execute(ruleId, updateData) {
        const { SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR } = this.events;

        try {
            const updatedRule = await this.ruleRepository.update(ruleId, updateData);

            if (updatedRule) {
                this.emit(SUCCESS, updatedRule);
            } else {
                this.emit(NOT_FOUND, `Rule with ID ${ruleId} not found`);
            }
        } catch (error) {
            if (error.message.startsWith('Validation failed:')) {
                this.emit(VALIDATION_ERROR, error.message);
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default UpdateRuleEvent;