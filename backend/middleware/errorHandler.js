// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send JSON response
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development
    });
};

module.exports = errorHandler;