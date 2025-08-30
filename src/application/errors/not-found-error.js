import { BaseError } from './base-error.js';

export class NotFoundError extends BaseError {
    constructor(resource, identifier) {
        const message = `${resource} with identifier '${identifier}' not found`;
        super(message, 404, 'NOT_FOUND');
        this.resource = resource;
        this.identifier = identifier;
    }
}
