import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const Rule = sequelize.define('Rule', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    blockConfirmationDelay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 20
        }
    },
    conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isValidConditions(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Conditions must be an array');
                }
                
                value.forEach((condition, index) => {
                    if (!condition.field || !condition.operator || condition.value === undefined) {
                        throw new Error(`Invalid condition at index ${index}`);
                    }
                    
                    const validOperators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains'];
                    if (!validOperators.includes(condition.operator)) {
                        throw new Error(`Invalid operator '${condition.operator}' at index ${index}`);
                    }
                });
            }
        }
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    }
}, {
    tableName: 'rules',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['name', 'version'],
            unique: true
        }
    ]
});

export default Rule;