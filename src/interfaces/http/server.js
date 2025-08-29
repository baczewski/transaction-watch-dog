import express from 'express';

class Server {
    constructor({ router }) {
        this.express = express();

        this.express.use(router);
    }

    start(port) {
        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default Server;