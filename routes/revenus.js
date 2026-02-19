import express from 'express';
import * as revenusController from '../controllers/revenusController.js';
import validate from '../middlewares/validate.js';
import { createRevenuSchema } from '../validations/budgetSchemas.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(revenusController.getAllRevenus)
  .post(validate(createRevenuSchema), revenusController.createRevenu);

router.route('/:id').delete(revenusController.deleteRevenu);

export default router;
