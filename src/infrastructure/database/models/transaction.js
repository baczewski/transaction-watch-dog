import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    ruleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'rules',
            key: 'id'
        }
    },
    hash: {
        type: DataTypes.STRING(66),
        allowNull: false,
        unique: true
    },
    from: {
        type: DataTypes.STRING(42),
        allowNull: false
    },
    to: {
        type: DataTypes.STRING(42),
        allowNull: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blockNumber: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['hash'],
            unique: true
        },
        {
            fields: ['rule_id']
        },
    ]
});

export default Transaction;