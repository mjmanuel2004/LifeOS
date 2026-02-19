import express from 'express';
import * as templatesEvenementsController from '../controllers/templatesEvenementsController.js';
import validate from '../middlewares/validate.js';
import {
  createTemplateSchema,
  createEventFromTemplateSchema,
} from '../validations/evenementSchemas.js';

const router = express.Router();

router
  .route('/')
  .get(templatesEvenementsController.getAllTemplates)
  .post(validate(createTemplateSchema), templatesEvenementsController.createTemplate);

router.post(
  '/:id/creer-evenement',
  validate(createEventFromTemplateSchema),
  templatesEvenementsController.creerEvenementDepuisTemplate
);

router.delete('/:id', templatesEvenementsController.deleteTemplate);

export default router;
