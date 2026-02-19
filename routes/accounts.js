import express from 'express';
import * as accountController from '../controllers/accountController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(accountController.getAccounts)
    .post(accountController.createAccount);

router.route('/:id')
    .patch(accountController.updateAccount);

router.post('/sync', accountController.syncSimulatedAccounts);

export default router;
