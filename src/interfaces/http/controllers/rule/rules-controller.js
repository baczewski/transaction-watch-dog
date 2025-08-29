import { StatusCodes } from 'http-status-codes';

class RulesController {
    constructor({ createRule, getRules, getRule, deactivateRule }) {
        this.createRule = createRule;
        this.getRules = getRules;
        this.getRule = getRule;
        this.deactivateRule = deactivateRule;
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

    getById(req, res, next) {
        const { getRule } = this;
        const { SUCCESS, NOT_FOUND, ERROR } = getRule.events;
        const { id } = req.params;

        getRule
            .on(SUCCESS, (rule) => {
                res.status(StatusCodes.OK).json(rule);
            })
            .on(NOT_FOUND, (message) => {
                res.status(StatusCodes.NOT_FOUND).json({ message });
            })
            .on(ERROR, (error) => {
                next(error);
            });

        getRule.execute(id);
    }

    deactivate(req, res, next) {
        const { deactivateRule } = this;
        const { SUCCESS, NOT_FOUND, ERROR } = deactivateRule.events;
        const { id } = req.params;

        deactivateRule
            .on(SUCCESS, () => {
                res.status(StatusCodes.OK).send();
            })
            .on(NOT_FOUND, (message) => {
                res.status(StatusCodes.NOT_FOUND).json({ message });
            })
            .on(ERROR, (error) => {
                next(error);
            });

        deactivateRule.execute(id);
    }
}

export default RulesController;