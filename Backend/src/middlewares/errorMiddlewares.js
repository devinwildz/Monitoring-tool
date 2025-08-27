import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const code = err.code || "SERVER_ERROR";
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

    res.status(statusCode).json({
        success: false,
        message,
        code,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default errorMiddleware;
