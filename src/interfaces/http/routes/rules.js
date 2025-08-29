import { Router } from 'express';
import { makeClassInvoker } from 'awilix-express';
import RulesController from '../controllers/rule/rules-controller.js';

const router = Router();

const api = makeClassInvoker(RulesController);

router.post('/', api('create'));

export default router;