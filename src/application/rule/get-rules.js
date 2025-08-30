import BaseEvent from "../base-event.js";

class GetRules extends BaseEvent {
    constructor({ ruleRepository }) {
        super({
            SUCCESS: 'SUCCESS',
            ERROR: 'ERROR',
        });
        this.ruleRepository = ruleRepository;
    }

    async execute() {
        const { SUCCESS, ERROR } = this.events;
        
        try {
            const rules = await this.ruleRepository.getAll();
            this.emit(SUCCESS, rules);
        } catch (error) {
            this.emit(ERROR, error);
        }
    }
}

export default GetRules;