const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules for creating an event
const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('date_time')
    .notEmpty()
    .withMessage('Date and time are required')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format')
    .custom((value) => {
      const eventDate = new Date(value);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Location must be between 2 and 255 characters'),
  
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be a positive integer between 1 and 1000'),
  
  handleValidationErrors,
];

// Validation rules for registering a user
const validateRegistration = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('event_id')
    .notEmpty()
    .withMessage('Event ID is required')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  handleValidationErrors,
];

// Validation rules for canceling registration
const validateCancelRegistration = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('event_id')
    .notEmpty()
    .withMessage('Event ID is required')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  handleValidationErrors,
];

// Validation rules for event ID parameter
const validateEventId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  handleValidationErrors,
];

// Validation rules for creating a user
const validateCreateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  handleValidationErrors,
];

module.exports = {
  validateCreateEvent,
  validateRegistration,
  validateCancelRegistration,
  validateEventId,
  validateCreateUser,
};