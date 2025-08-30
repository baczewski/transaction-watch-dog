import Rule from "./rule.js";
import RuleHead from "./rule-heads.js";
import Transaction from "./transaction.js";

export function defineAssociations() {
    RuleHead.belongsTo(Rule, {
        foreignKey: 'currentRuleId',
        as: 'currentRule'
    });

    Rule.hasOne(RuleHead, {
        foreignKey: 'currentRuleId',
        as: 'ruleHead'
    });

    Rule.hasMany(Transaction, {
        foreignKey: 'ruleId',
        as: 'transactions'
    });

    Transaction.belongsTo(Rule, {
        foreignKey: 'ruleId',
        as: 'rule'
    });
}