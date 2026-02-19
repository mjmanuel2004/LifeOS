import express from 'express';
import * as depensesController from '../controllers/depensesController.js';
import validate from '../middlewares/validate.js';
import { createDepenseSchema } from '../validations/budgetSchemas.js';
import { protect } from '../middlewares/authMiddleware.js';

import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.post('/scan', upload.single('image'), depensesController.scanTicket);

router
  .route('/')
  .get(depensesController.getAllDepenses)
  .post(validate(createDepenseSchema), depensesController.createDepense);

router.route('/:id').delete(depensesController.deleteDepense);

export default router;
