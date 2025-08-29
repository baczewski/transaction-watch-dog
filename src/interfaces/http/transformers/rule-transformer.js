class RuleTransfomer {
    toDomain(dbRule) {
        if (!dbRule) return null;

        return {
            id: dbRule.id,
            name: dbRule.name,
            version: dbRule.version,
            isActive: dbRule.isActive,
            blockConfirmationDelay: dbRule.blockConfirmationDelay,
            conditions: dbRule.conditions || [],
            metadata: dbRule.metadata || {},
            createdAt: dbRule.createdAt,
            updatedAt: dbRule.updatedAt
        };
    }

    toPersistence(domainRule) {
        if (!domainRule) return null;

        return {
            id: domainRule.id,
            name: domainRule.name,
            version: domainRule.version,
            isActive: domainRule.isActive,
            blockConfirmationDelay: domainRule.blockConfirmationDelay,
            conditions: domainRule.conditions || [],
            metadata: domainRule.metadata || {}
        };
    }
}

export default RuleTransfomer;