class WatchDog {
    constructor({ logger, wsProvider, httpProvider, TransactionMatcher, transactionMatch }) {
        this.logger = logger;
        this.wsProvider = wsProvider;
        this.httpProvider = httpProvider;
        this.TransactionMatcher = TransactionMatcher;
        this.transactionMatch = transactionMatch;
    }

    start() {
        this.logger.info('WatchDog started');
        this.createWebSocketConnection();
        this.registerTransactionMatchEvents();
    }

    registerTransactionMatchEvents() {
        const { SUCCESS, ERROR } = this.transactionMatch.events;

        this.transactionMatch.on(SUCCESS, (transaction) => {
            this.logger.info(`Transaction ${transaction.hash} processed successfully`);
        });

        this.transactionMatch.on(ERROR, (error) => {
            this.logger.error('Error processing transaction match:', error);
        });
    }

    createWebSocketConnection() {
        this.wsProvider.on('block', async (blockNumber) => {
            await this.handleNewBlock(blockNumber);
        });

        this.wsProvider.on('error', (error) => {
            this.logger.error('WebSocket error:', error);
        });
    }

    async handleNewBlock(blockNumber) {
        try {
            this.logger.info(`New block mined: ${blockNumber}`);
            
            const block = await this.httpProvider.getBlock(blockNumber);
            if (!block) {
                this.logger.warn(`Block ${blockNumber} not found`);
                return;
            }

            this.logger.info(`Processing block ${block.number} with ${block.transactions.length} transactions`);
            await this.processBlock(block);
        } catch (error) {
            this.logger.error(`Error handling block ${blockNumber}:`, error);
        }
    }

    async processBlock(block) {
        for (const txHash of block.transactions) {
            try {
                await this.processTransaction(txHash);
            } catch (error) {
                this.logger.error(`Error processing transaction ${txHash}:`, error);
            }
        }
    }

    async processTransaction(transactionHash) {
        const tx = await this.httpProvider.getTransaction(transactionHash);
        if (!tx) {
            this.logger.warn(`Transaction ${transactionHash} not found`);
            return;
        }
        this.logger.info(`Processing transaction ${tx.hash}`);
        const matchingRule = await this.TransactionMatcher.matchTransaction(tx);

        if (matchingRule) {
            this.logger.info(`Transaction ${tx.hash} matched rule ${matchingRule.id}`);
            await this.transactionMatch.execute(tx, matchingRule);
        }
    }
}

export default WatchDog;