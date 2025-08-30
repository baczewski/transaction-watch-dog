import BaseUseCase from "../../shared/base-use-case.js";
import { NotFoundError, ValidationError } from "../../errors/index.js";
import { updateRuleSchema } from "../../validation/rule.js";

class UpdateRule extends BaseUseCase {
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
            const validatedData = await updateRuleSchema.validate(updateData, {
                abortEarly: false,
                stripUnknown: true
            });

            const updatedRule = await this.ruleRepository.update(ruleId, validatedData);
            this.emit(SUCCESS, updatedRule);
        } catch (error) {
            if (error.name === 'ValidationError') {
                this.emit(VALIDATION_ERROR, ValidationError.fromYupError(error));
                return;
            }
            if (error instanceof NotFoundError) {
                this.emit(NOT_FOUND, error.message);
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default UpdateRule;