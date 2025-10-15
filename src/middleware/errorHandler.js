/**
 * Global error handling middleware
 * Catches and formats all errors in the application
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        statusCode = 409;
        if (err.constraint === 'registrations_user_id_event_id_key') {
          message = 'User is already registered for this event';
        } else if (err.constraint === 'users_email_key') {
          message = 'Email already exists';
        } else {
          message = 'Duplicate entry detected';
        }
        break;
      
      case '23503': // Foreign key violation
        statusCode = 404;
        message = 'Referenced resource does not exist';
        break;
      
      case '23502': // Not null violation
        statusCode = 400;
        message = 'Required field is missing';
        break;
      
      case '23514': // Check constraint violation
        statusCode = 400;
        message = 'Invalid value provided';
        break;
      
      case '22P02': // Invalid text representation
        statusCode = 400;
        message = 'Invalid data format';
        break;
      
      case '08006': // Connection failure
      case '08003': // Connection does not exist
        statusCode = 503;
        message = 'Database connection error';
        break;
      
      default:
        // Log unhandled database errors
        console.error('Unhandled database error code:', err.code);
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err,
      }),
    },
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};