import express from 'express';
import * as recettesController from '../controllers/recettesController.js';
import validate from '../middlewares/validate.js';
import { createRecetteSchema, updateRecetteSchema } from '../validations/cuisineSchemas.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes

// Routes
router.post('/generate', recettesController.generateRecette);
router.route('/')
  .get(recettesController.getAllRecettes)
  .post(validate(createRecetteSchema), recettesController.createRecette);

router.post('/seed', recettesController.seedRecettes);

router
  .route('/:id')
  .get(recettesController.getRecette)
  .patch(validate(updateRecetteSchema), recettesController.updateRecette)
  .delete(recettesController.deleteRecette);

export default router;
