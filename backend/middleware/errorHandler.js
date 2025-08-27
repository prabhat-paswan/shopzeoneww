const { ValidationError, DatabaseError, ConnectionError } = require('sequelize');

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Sequelize validation errors
  if (err instanceof ValidationError) {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Sequelize database errors
  if (err instanceof DatabaseError) {
    if (err.parent && err.parent.code === 'ER_DUP_ENTRY') {
      error = new AppError('Duplicate field value entered', 400);
    } else if (err.parent && err.parent.code === 'ER_NO_REFERENCED_ROW_2') {
      error = new AppError('Referenced record does not exist', 400);
    } else {
      error = new AppError('Database operation failed', 500);
    }
  }

  // Sequelize connection errors
  if (err instanceof ConnectionError) {
    error = new AppError('Database connection failed', 500);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large', 400);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new AppError('Too many files', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new AppError('Unexpected file field', 400);
  }

  // Cast errors (MongoDB ObjectId)
  if (err.name === 'CastError') {
    error = new AppError('Invalid ID format', 400);
  }

  // Duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`Duplicate ${field} value`, 400);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Default error
  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = 'Internal Server Error';
  }

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        details: err
      }
    });
  }

  // Production error response
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  // Programming or unknown errors
  return res.status(500).json({
    success: false,
    message: 'Something went wrong'
  });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error formatter
const formatValidationErrors = (errors) => {
  const formattedErrors = {};
  
  errors.forEach(error => {
    const field = error.path || error.field;
    if (!formattedErrors[field]) {
      formattedErrors[field] = [];
    }
    formattedErrors[field].push(error.message);
  });
  
  return formattedErrors;
};

// Rate limit error handler
const rateLimitErrorHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests, please try again later',
    retryAfter: Math.ceil(process.env.RATE_LIMIT_WINDOW_MS / 1000)
  });
};

// Database error handler
const handleDatabaseError = (error) => {
  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      message: 'Validation failed',
      errors: formatValidationErrors(error.errors)
    };
  }
  
  if (error instanceof DatabaseError) {
    return {
      statusCode: 500,
      message: 'Database operation failed'
    };
  }
  
  if (error instanceof ConnectionError) {
    return {
      statusCode: 503,
      message: 'Service temporarily unavailable'
    };
  }
  
  return {
    statusCode: 500,
    message: 'Internal server error'
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler,
  formatValidationErrors,
  rateLimitErrorHandler,
  handleDatabaseError
};
