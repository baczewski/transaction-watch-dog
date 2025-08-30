import { StatusCodes } from 'http-status-codes';

class TransactionsController {
    constructor({ getTransactionsByRuleId }) {
        this.getTransactionsByRuleId = getTransactionsByRuleId;
    }

    getAllByRuleId(req, res, next) {
        const { getTransactionsByRuleId } = this;
        const { SUCCESS, ERROR } = getTransactionsByRuleId.events;
        const { ruleId } = req.params;

        getTransactionsByRuleId
            .on(SUCCESS, (transactions) => {
                res.status(StatusCodes.OK).json(transactions);
            })
            .on(ERROR, (error) => {
                next(error);
            });

        getTransactionsByRuleId.execute(ruleId);
    }
}

export default TransactionsController;