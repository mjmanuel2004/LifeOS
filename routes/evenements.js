import express from 'express';
import * as evenementsController from '../controllers/evenementsController.js';
import validate from '../middlewares/validate.js';
import { createEvenementSchema, importIcsSchema } from '../validations/evenementSchemas.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(evenementsController.getAllEvenements)
  .post(evenementsController.createEvenement);

router.post('/seed', evenementsController.seedEvenements);

router.route('/:id').get(evenementsController.getEvenement).put(evenementsController.updateEvenement).delete(evenementsController.deleteEvenement);

router.get('/prochain', evenementsController.getProchainEvenement);
router.post('/import-ics', validate(importIcsSchema), evenementsController.importIcs);
router.delete('/:id', evenementsController.deleteEvenement);

export default router;
