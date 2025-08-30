import { BaseError } from './base-error.js';

export class ConflictError extends BaseError {
    constructor(message, details = null) {
        super(message, 409, 'CONFLICT', details);
    }
}
