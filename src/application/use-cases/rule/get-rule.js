import BaseUseCase from "../../shared/base-use-case.js";
import { NotFoundError } from "../../errors/not-found-error.js";

class GetRule extends BaseUseCase {
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

export default GetRule;