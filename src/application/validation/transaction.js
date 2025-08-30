import * as yup from 'yup';

export const createTransactionSchema = yup.object({
    hash: yup.string()
        .required('Transaction hash is required')
        .matches(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format')
        .length(66, 'Transaction hash must be 66 characters'),
    
    from: yup.string()
        .required('From address is required')
        .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid from address format')
        .length(42, 'From address must be 42 characters'),
    
    to: yup.string()
        .nullable()
        .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid to address format')
        .length(42, 'To address must be 42 characters'),
    
    value: yup.string()
        .required('Value is required')
        .matches(/^[0-9]+$/, 'Value must be a numeric string'),
    
    blockNumber: yup.number()
        .integer('Block number must be an integer')
        .min(0, 'Block number must be non-negative')
        .required('Block number is required'),
    
    ruleId: yup.string()
        .uuid('Rule ID must be a valid UUID')
        .required('Rule ID is required')
});