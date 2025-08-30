import { Router } from 'express';
import rulesRouter from './routes/rules.js';
import transactionsRouter from './routes/transactions.js';

function createRouter({ containerMiddleware, rateLimiterMiddleware }) {
    const router = Router();
    const apiRooter = Router();

    apiRooter.use(containerMiddleware);
    apiRooter.use(rateLimiterMiddleware.generalLimiter());

    apiRooter.use('/rules', rulesRouter);
    apiRooter.use('/transactions', transactionsRouter);
    router.use('/api',  apiRooter);
    
    return router;
}

export default createRouter;