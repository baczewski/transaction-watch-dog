import Rule from "./rule.js";
import RuleHead from "./rule-heads.js";

export function defineAssociations() {
    RuleHead.belongsTo(Rule, {
        foreignKey: 'currentRuleId',
        as: 'currentRule'
    });

    Rule.hasOne(RuleHead, {
        foreignKey: 'currentRuleId',
        as: 'ruleHead'
    });
}