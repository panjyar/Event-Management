const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers');
const { validateCreateUser } = require('../middleware/validator');
const { param } = require('express-validator');

router.post('/', validateCreateUser, UserController.createUser);

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUserById);

router.get('/:id/events', UserController.getUserEvents);

module.exports = router;