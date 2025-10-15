const UserModel = require('../models/userModel');

class UserController {
  
  static async createUser(req, res, next) {
    try {
      const { name, email } = req.body;

      const user = await UserModel.create({ name, email });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Email already exists',
          },
        });
      }
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();

      res.status(200).json({
        success: true,
        data: {
          count: users.length,
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const userId = parseInt(req.params.id);

      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User not found',
          },
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserEvents(req, res, next) {
    try {
      const userId = parseInt(req.params.id);

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User not found',
          },
        });
      }

      const events = await UserModel.getUserEvents(userId);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          events_count: events.length,
          events,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;