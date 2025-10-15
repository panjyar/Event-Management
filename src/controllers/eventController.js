const EventModel = require('../models/eventModel').default;
const UserModel = require('../models/userModel').default;
const { getUpcomingEventsSorted } = require('../utils/sortEvents');

class EventController {

  static async createEvent(req, res, next) {
    try {
      const { title, date_time, location, capacity } = req.body;

      const event = await EventModel.create({
        title,
        date_time,
        location,
        capacity,
      });

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: {
          event_id: event.id,
          event,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEventDetails(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);

      const event = await EventModel.findById(eventId);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Event not found',
          },
        });
      }

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async registerForEvent(req, res, next) {
    try {
      const { user_id, event_id } = req.body;

      const userExists = await UserModel.exists(user_id);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User not found',
          },
        });
      }

      const event = await EventModel.findById(event_id);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Event not found',
          },
        });
      }

      const isPast = await EventModel.isPastEvent(event_id);
      if (isPast) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Cannot register for past events',
          },
        });
      }
      const isRegistered = await EventModel.isUserRegistered(user_id, event_id);
      if (isRegistered) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'User is already registered for this event',
          },
        });
      }

      const isFull = await EventModel.isFull(event_id);
      if (isFull) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Event is full. Registration capacity has been reached',
          },
        });
      }
      const registration = await EventModel.registerUser(user_id, event_id);

      res.status(201).json({
        success: true,
        message: 'Successfully registered for the event',
        data: {
          registration_id: registration.id,
          user_id: registration.user_id,
          event_id: registration.event_id,
          registered_at: registration.registered_at,
        },
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: {
            message: 'User is already registered for this event',
          },
        });
      }
      next(error);
    }
  }

  static async cancelRegistration(req, res, next) {
    try {
      const { user_id, event_id } = req.body;

      const userExists = await UserModel.exists(user_id);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User not found',
          },
        });
      }
      const event = await EventModel.findById(event_id);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Event not found',
          },
        });
      }

      const isRegistered = await EventModel.isUserRegistered(user_id, event_id);
      if (!isRegistered) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User is not registered for this event',
          },
        });
      }

      await EventModel.cancelRegistration(user_id, event_id);

      res.status(200).json({
        success: true,
        message: 'Registration cancelled successfully',
        data: {
          user_id,
          event_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async listUpcomingEvents(req, res, next) {
    try {
      const events = await EventModel.findUpcoming();

      const sortedEvents = getUpcomingEventsSorted(events);

      res.status(200).json({
        success: true,
        data: {
          count: sortedEvents.length,
          events: sortedEvents,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async getEventStats(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);

      const event = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Event not found',
          },
        });
      }

      const stats = await EventModel.getStats(eventId);

      res.status(200).json({
        success: true,
        data: {
          event_id: eventId,
          event_title: event.title,
          total_registrations: parseInt(stats.total_registrations),
          remaining_capacity: parseInt(stats.remaining_capacity),
          percentage_filled: parseFloat(stats.percentage_filled),
          capacity: stats.capacity,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EventController;