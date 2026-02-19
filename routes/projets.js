import express from 'express';
import * as projetsController from '../controllers/projetsController.js';

const router = express.Router();

router.route('/')
    .get(projetsController.getAllProjets)
    .post(projetsController.createProjet);

router.post('/seed', projetsController.seedProjets);

router.route('/:id')
    .get(projetsController.getProjet)
    .patch(projetsController.updateProjet)
    .delete(projetsController.deleteProjet);

export default router;
