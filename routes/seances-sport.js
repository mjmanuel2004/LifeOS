import express from 'express';
import * as seancesSportController from '../controllers/seancesSportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(seancesSportController.getAllSeances)
  .post(seancesSportController.createSeance);

router.post('/seed', seancesSportController.seedSeances);

router.route('/:id')
  .get(seancesSportController.getSeance)
  .delete(seancesSportController.deleteSeance);

export default router;
