import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const RuleHead = sequelize.define('RuleHead', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    // Do I need name, or can I get it from the current rule?
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    currentRuleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'rules',
            key: 'id'
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'rule_heads',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['name']
        },
        {
            fields: ['is_active']
        }
    ]
});

export default RuleHead;