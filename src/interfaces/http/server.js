import express from 'express';

class Server {
    constructor({ router, errorHandler }) {
        this.express = express();
        this.setupMiddleware();
        this.express.use(router);
        
        this.express.use(errorHandler);
    }

    setupMiddleware() {
        this.express.use(express.json({ limit: '10mb' }));
        this.express.use(express.urlencoded({ extended: true, limit: '10mb' }));
    }

    start(port) {
        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default Server;