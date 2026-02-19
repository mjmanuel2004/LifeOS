import express from 'express';
import * as calendarController from '../controllers/calendarController.js';

const router = express.Router();

router.get('/', calendarController.getCalendarItems);
router.post('/event', calendarController.createEvent);
router.post('/task', calendarController.createTask);

export default router;
