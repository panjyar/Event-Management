const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const {
  validateCreateEvent,
  validateRegistration,
  validateCancelRegistration,
  validateEventId,
} = require('../middleware/validator');


router.post('/', validateCreateEvent, EventController.createEvent);

router.get('/upcoming', EventController.listUpcomingEvents);


router.post('/register', validateRegistration, EventController.registerForEvent);


router.post('/cancel', validateCancelRegistration, EventController.cancelRegistration);


router.get('/:id', validateEventId, EventController.getEventDetails);

router.get('/:id/stats', validateEventId, EventController.getEventStats);

module.exports = router;