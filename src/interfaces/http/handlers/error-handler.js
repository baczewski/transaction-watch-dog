import { StatusCodes } from 'http-status-codes';
import { ValidationError, NotFoundError, ConflictError, BaseError } from '../../../application/errors/index.js';

export const errorHandler = (err, req, res, next) => {
    const { logger } = req.container.cradle;

    // Log the error details
    logger.error(err.message);

    if (err instanceof ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: {
                type: 'validation_error',
                message: err.message,
                details: err.details,
            }
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: {
                type: 'not_found',
                message: err.message,
                resource: err.resource,
                identifier: err.identifier,
            }
        });
    }

    if (err instanceof ConflictError) {
        return res.status(StatusCodes.CONFLICT).json({
            error: {
                type: 'conflict',
                message: err.message,
                details: err.details,
            }
        });
    }

    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            error: {
                type: 'application_error',
                message: err.message,
                code: err.code,
                details: err.details,
            }
        });
    }

    if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map(error => ({
            field: error.path,
            message: error.message,
            value: error.value
        }));

        return res.status(StatusCodes.BAD_REQUEST).json({
            error: {
                type: 'validation_error',
                message: 'Database validation failed',
                details: validationErrors,
            }
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
            error: {
                type: 'conflict',
                message: 'Resource already exists',
                details: err.errors.map(error => ({
                    field: error.path,
                    message: error.message
                })),
            }
        });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: {
            type: 'internal_error',
            message: 'Internal Server Error',
        }
    });
};
