"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.createError = createError;
const logger_1 = require("@/utils/logger");
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 500000;
    logger_1.logger.error('API Error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;
    res.status(statusCode).json({
        code: errorCode,
        message: message,
        data: null,
        meta: {
            requestId: req.headers['x-request-id'] || 'unknown',
            timestamp: new Date().toISOString()
        }
    });
}
function createError(message, statusCode = 500, code = 500000, details) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.details = details;
    return error;
}
//# sourceMappingURL=errorHandler.js.map