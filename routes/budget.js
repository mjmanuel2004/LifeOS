import express from 'express';
import * as budgetController from '../controllers/budgetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/mensuel', budgetController.getBudgetSummary);

export default router;
