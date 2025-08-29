import { Router } from 'express';
import rulesRouter from './routes/rules.js';

function createRouter({ containerMiddleware }) {
    const router = Router();
    const apiRooter = Router();

    apiRooter.use(containerMiddleware);

    apiRooter.use('/rules', rulesRouter);
    router.use('/api',  apiRooter);
    
    return router;
}

export default createRouter;