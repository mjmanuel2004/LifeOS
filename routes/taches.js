import express from 'express';
import * as tachesController from '../controllers/tachesController.js';
import validate from '../middlewares/validate.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createTacheSchema, updateTacheSchema } from '../validations/tacheSchemas.js';

const router = express.Router();

// Apply protect to all routes below this point
router.use(protect);

router
  .route('/')
  .get(tachesController.getAllTaches)
  .post(validate(createTacheSchema), tachesController.createTache);

router
  .route('/:id')
  .patch(validate(updateTacheSchema), tachesController.updateTache)
  .delete(tachesController.deleteTache);

export default router;
