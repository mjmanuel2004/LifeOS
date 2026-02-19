import express from 'express';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', aiController.getFinancialAnalysis);
router.post('/context', aiController.getLifeContextAdvice);

export default router;
