class TransactionTransformer {
    toDomain(dbTransaction) {
        if (!dbTransaction) return null;

        return {
            id: dbTransaction.id,
            ruleId: dbTransaction.ruleId,
            hash: dbTransaction.hash,
            from: dbTransaction.from,
            to: dbTransaction.to,
            value: dbTransaction.value,
            blockNumber: dbTransaction.blockNumber,
            createdAt: dbTransaction.createdAt,
            updatedAt: dbTransaction.updatedAt
        };
    }

    toPersistence(domainTransaction) {
        if (!domainTransaction) return null;

        return {
            id: domainTransaction.id,
            ruleId: domainTransaction.ruleId,
            hash: domainTransaction.hash,
            from: domainTransaction.from,
            to: domainTransaction.to,
            value: domainTransaction.value,
            blockNumber: domainTransaction.blockNumber,
        };
    }
}

export default TransactionTransformer;