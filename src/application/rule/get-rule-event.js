import BaseEvent from "../base-event.js";

class GetRuleEvent extends BaseEvent {
    constructor({ ruleRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR',
            NOT_FOUND: 'NOT_FOUND',
        });
        this.ruleRepository = ruleRepository;
    }

    async execute(ruleId) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.events;
        
        try {
            const rule = await this.ruleRepository.getById(ruleId);

            if (rule) {
                this.emit(SUCCESS, rule);
            } else {
                this.emit(NOT_FOUND, `Rule with ID ${ruleId} not found`);
            }
        } catch (error) {
            this.emit(ERROR, error);
        }
    }
}

export default GetRuleEvent;