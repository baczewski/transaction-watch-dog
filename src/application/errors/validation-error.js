import { BaseError } from './base-error.js';

export class ValidationError extends BaseError {
    constructor(message, fieldErrors = []) {
        super(
            message || 'Validation failed',
            400,
            'VALIDATION_ERROR',
            fieldErrors
        );
    }

    static fromYupError(yupError) {
        const fieldErrors = yupError.inner.map(err => ({
            field: err.path,
            message: err.message,
            value: err.value
        }));

        return new ValidationError('Validation failed', fieldErrors);
    }
}
