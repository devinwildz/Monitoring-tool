const createError = (statusCode, message, options = {}) => {
    const error = new Error(message);

    error.statusCode = statusCode;

    if (options.code) error.code = options.code;              // custom error code (e.g. USER_NOT_FOUND)
    if (options.details) error.details = options.details;      // extra error info
    if (options.stack) error.stack = options.stack;            // custom stack (rare case)
    if (options.isOperational !== undefined) error.isOperational = options.isOperational;

    return error;
};

export default createError;
