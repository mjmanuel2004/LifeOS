import express from 'express';
import * as planningSemaineController from '../controllers/planningSemaineController.js';
import validate from '../middlewares/validate.js';
import { updatePlanningSchema } from '../validations/cuisineSchemas.js';

const router = express.Router();

router.get('/', planningSemaineController.getPlanning);
router.put('/', validate(updatePlanningSchema), planningSemaineController.updatePlanning);

export default router;
