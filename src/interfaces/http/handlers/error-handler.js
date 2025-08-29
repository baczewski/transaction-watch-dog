import { StatusCodes } from 'http-status-codes';

// TODO: Improve error handling (e.g., different status codes for different errors)
export const errorHandler = (err, req, res, next) => {
    const { logger } = req.container.cradle;

    logger.error(err.message);
        
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        message: err.message,
    });
}
