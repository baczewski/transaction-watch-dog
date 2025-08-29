import { StatusCodes } from 'http-status-codes';

class RulesController {
    constructor({ createRule, getRules }) {
        this.createRule = createRule;
        this.getRules = getRules;
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

    getAll(req, res, next) {
        const { getRules } = this;
        const { SUCCESS, ERROR } = getRules.events;

        getRules
            .on(SUCCESS, (rules) => {
                res.status(StatusCodes.OK).json(rules);
            })
            .on(ERROR, (error) => {
                next(error);
            });

        getRules.execute();
    }
}

export default RulesController;