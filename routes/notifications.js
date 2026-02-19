import express from 'express';
import * as notificationsController from '../controllers/notificationsController.js';

const router = express.Router();

router.get('/', notificationsController.getUnreadNotifications);
router.patch('/:id/read', notificationsController.markAsRead);
router.post('/clear', notificationsController.clearAll);

export default router;
