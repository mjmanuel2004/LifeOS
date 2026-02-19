import express from 'express';
import * as listeCoursesController from '../controllers/listeCoursesController.js';
import validate from '../middlewares/validate.js';
import {
  generateListeSchema,
  updateListeSchema,
  toggleItemSchema,
} from '../validations/cuisineSchemas.js';

const router = express.Router();

router.get('/', listeCoursesController.getListe);
router.post('/generer', validate(generateListeSchema), listeCoursesController.genererListe);
router.put('/:id?', validate(updateListeSchema), listeCoursesController.updateListe);
router.patch('/:id/items/:index', validate(toggleItemSchema), listeCoursesController.toggleItem);

export default router;
