const OPERATORS = {
    eq: (a, b) => a === b,
    ne: (a, b) => a !== b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    in: (a, b) => Array.isArray(b) && b.includes(a),
    nin: (a, b) => Array.isArray(b) && !b.includes(a),
    contains: (a, b) =>
        String(a).toLowerCase().includes(String(b).toLowerCase()),
};

const FIELD_EXTRACTORS = {
    from: (tx) => tx.from?.toLowerCase(),
    to: (tx) => tx.to?.toLowerCase(),
    value: (tx) => tx.value?.toString(),
    gasprice: (tx) => tx.gasPrice?.toString(),
    gasused: (tx) => tx.gasUsed?.toString(),
    gaslimit: (tx) => tx.gasLimit?.toString(),
    nonce: (tx) => tx.nonce?.toString(),
    data: (tx) => tx.data,
    blocknumber: (tx) => tx.blockNumber?.toString(),
    blockhash: (tx) => tx.blockHash?.toLowerCase(),
    hash: (tx) => tx.hash?.toLowerCase(),
    status: (tx) => (tx.status === 1 ? 'confirmed' : 'failed'),
    confirmations: (tx) => tx.confirmations?.toString(),
};

class TransactionMatcher {
    constructor({ ruleCacheService }) {
        this.ruleRepository = ruleCacheService;
    }

    async matchTransaction(transaction) {
        const rules = await this.ruleRepository.getCachedRules();
        return rules.find((rule) => this.matchesRule(transaction, rule));
    }

    matchesRule(transaction, rule) {
        try {
            return rule.conditions.every((c) =>
                this.matchesCondition(transaction, c)
            );
        } catch (error) {
            console.error('Error matching rule:', error);
            return false;
        }
    }

    matchesCondition(transaction, { field, operator, value }) {
        const transactionValue = this.getTransactionValue(transaction, field);
        if (transactionValue == null) return false;

        const isNumericOp = ['gt', 'gte', 'lt', 'lte'].includes(operator);
        const a = isNumericOp ? this.parseNumber(transactionValue) : transactionValue;
        const b = isNumericOp ? this.parseNumber(value) : value;

        if (isNumericOp && (a == null || b == null)) return false;

        const opFn = OPERATORS[operator];
        return opFn ? opFn(a, b) : false;
    }

    getTransactionValue(transaction, field) {
        const fn = FIELD_EXTRACTORS[field.toLowerCase()];
        return fn ? fn(transaction) : undefined;
    }

    parseNumber(value) {
        if (typeof value === 'bigint') return value;

        if (typeof value === 'number') {
            return BigInt(value);
        }

        if (typeof value === 'string') {
            if (value.startsWith('0x')) {
                return BigInt(value);
            }
            const parsed = BigInt(value);
            return parsed;
        }

        return null;
    }
}

export default TransactionMatcher;