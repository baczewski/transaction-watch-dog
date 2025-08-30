import express, { json, urlencoded } from 'express';
import config from '../../infrastructure/config/config.js';
import cors from 'cors';
import helmet from 'helmet';

class Server {
    constructor({ router, errorHandler }) {
        this.express = express();
        this.setupMiddleware();
        this.express.use(router);
        this.express.use(errorHandler);
    }

    setupMiddleware() {
        this.express.use(cors({ origin: config.get('cors.origin'), optionsSuccessStatus: 200 }));
        this.express.use(helmet());
        this.express.use(json({ limit: '10mb' }));
        this.express.use(urlencoded({ extended: true, limit: '10mb' }));
    }

    start(port) {
        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default Server;