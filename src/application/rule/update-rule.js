import BaseEvent from "../base-event.js";
import { NotFoundError, ValidationError } from "../errors/index.js";

class UpdateRule extends BaseEvent {
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
            this.emit(SUCCESS, updatedRule);
        } catch (error) {
            if (error instanceof NotFoundError) {
                this.emit(NOT_FOUND, error.message);
                return;
            }
            if (error instanceof ValidationError) {
                this.emit(VALIDATION_ERROR, error);
                return;
            }
            this.emit(ERROR, error);
        }
    }
}

export default UpdateRule;