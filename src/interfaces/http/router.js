import { Router } from 'express';
import compression from 'compression';
import rulesRouter from './routes/rules.js';
import transactionsRouter from './routes/transactions.js';

function createRouter({ containerMiddleware, rateLimiterMiddleware, swaggerMiddleware }) {
    const router = Router();
    const apiRooter = Router();

    apiRooter.use(containerMiddleware);
    apiRooter.use(rateLimiterMiddleware.generalLimiter());
    apiRooter.use(compression());

    apiRooter.use('/rules', rulesRouter);
    apiRooter.use('/transactions', transactionsRouter);
    apiRooter.use('/docs', swaggerMiddleware.middleware());
    
    router.use('/api',  apiRooter);
    
    return router;
}

export default createRouter;