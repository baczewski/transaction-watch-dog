import * as yup from 'yup';

const conditionSchema = yup.object({
    field: yup.string().required('Field is required'),
    operator: yup.string()
        .oneOf(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains'], 'Invalid operator')
        .required('Operator is required'),
    value: yup.mixed().required('Value is required')
});

export const createRuleSchema = yup.object({
    name: yup.string()
        .required('Rule name is required')
        .min(1, 'Rule name must not be empty')
        .max(255, 'Rule name too long'),
    
    version: yup.number()
        .integer('Version must be an integer')
        .min(1, 'Version must be at least 1')
        .default(1),
    
    isActive: yup.boolean()
        .default(true),
    
    blockConfirmationDelay: yup.number()
        .integer('Block confirmation delay must be an integer')
        .min(0, 'Block confirmation delay must be at least 0')
        .max(20, 'Block confirmation delay cannot exceed 20')
        .default(0),
    
    conditions: yup.array()
        .of(conditionSchema)
        .min(1, 'At least one condition is required')
        .required('Conditions are required'),
    
    metadata: yup.mixed()
        .default({}),
    
    changeReason: yup.string()
        .max(500, 'Change reason too long')
        .optional()
});

export const updateRuleSchema = yup.object({
    name: yup.string()
        .min(1, 'Name must not be empty')
        .max(255, 'Name must be less than 255 characters')
        .optional(),
    
    version: yup.number()
        .integer('Version must be an integer')
        .min(1, 'Version must be at least 1')
        .optional(),
    
    blockConfirmationDelay: yup.number()
        .integer('Block confirmation delay must be an integer')
        .min(0, 'Block confirmation delay must be at least 0')
        .max(20, 'Block confirmation delay must be at most 20')
        .optional(),
    
    conditions: yup.array()
        .of(conditionSchema)
        .min(1, 'At least one condition is required')
        .optional(),
    
    metadata: yup.mixed()
        .optional()
}).test(
    'at-least-one-field',
    'At least one field must be provided for update',
    function(value) {
        const { name, version, isActive, blockConfirmationDelay, conditions, metadata } = value;
        return name !== undefined || 
               version !== undefined || 
               isActive !== undefined || 
               blockConfirmationDelay !== undefined || 
               conditions !== undefined || 
               metadata !== undefined;
    }
);