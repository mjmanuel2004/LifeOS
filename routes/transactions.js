import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(transactionController.getAllTransactions)
    .post(transactionController.createTransaction);

router.route('/account/:accountId')
    .get(transactionController.getTransactionsByAccount);

export default router;
