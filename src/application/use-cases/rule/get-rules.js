import BaseUseCase from "../../shared/base-use-case.js";

class GetRules extends BaseUseCase {
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