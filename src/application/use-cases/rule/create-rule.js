import BaseUseCase from "../../shared/base-use-case.js";
import { ValidationError } from "../../errors/index.js";
import { createRuleSchema } from "../../validation/rule.js";

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
            const validatedData = await createRuleSchema.validate(ruleData, {
                abortEarly: false,
                stripUnknown: true
            });

            const newRule = await this.ruleRepository.create(validatedData);
            this.emit(SUCCESS, newRule);
        } catch (error) {
            if (error.name === 'ValidationError') {
                this.emit(VALIDATION_ERROR, ValidationError.fromYupError(error));
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default CreateRule;