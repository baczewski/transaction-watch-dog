import BaseUseCase from "../../shared/base-use-case.js";
import { ValidationError } from "../../errors/index.js";

class CreateRule extends BaseUseCase {
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
            const newRule = await this.ruleRepository.create(ruleData);
            this.emit(SUCCESS, newRule);
        } catch (error) {
            if (error instanceof ValidationError) {
                this.emit(VALIDATION_ERROR, error);
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default CreateRule;