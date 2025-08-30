import { Router } from 'express';
import { makeClassInvoker } from 'awilix-express';
import TransactionsController from '../controllers/transaction/transactions-controller.js';

const router = Router();

const api = makeClassInvoker(TransactionsController);

router.get('/rule/:ruleId', api('getAllByRuleId'));

export default router;