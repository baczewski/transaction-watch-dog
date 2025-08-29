import { StatusCodes } from 'http-status-codes';

class RulesController {
    constructor({ createRule }) {
        this.createRule = createRule;
    }

    create(req, res, next) {
        const { createRule } = this;
        const { SUCCESS, VALIDATION_ERROR, ERROR } = createRule.events;

        createRule
            .on(SUCCESS, (rule) => {
                res.status(StatusCodes.CREATED).json(rule);
            })
            .on(VALIDATION_ERROR, (error) => {
                res.status(StatusCodes.BAD_REQUEST).json({
                    type: 'validation_error',
                    details: error,
                });
            })
            .on(ERROR, (error) => {
                next(error);
            });

        createRule.execute(req.body);
    } 
}

export default RulesController;