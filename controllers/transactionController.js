import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllTransactions = catchAsync(async (req, res, next) => {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).populate('accountId', 'name color');

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: { transactions }
    });
});

export const createTransaction = catchAsync(async (req, res, next) => {
    const { accountId, amount, type } = req.body;
    req.body.user = req.user.id;

    // 1. Create Transaction
    const transaction = await Transaction.create(req.body);

    // 2. Update Account Balance
    const account = await Account.findOne({ _id: accountId, user: req.user.id });
    if (!account) return next(new AppError('Account not found', 404));

    if (type === 'CREDIT') {
        account.balance += amount;
    } else {
        account.balance -= amount;
    }
    await account.save();

    res.status(201).json({
        status: 'success',
        data: { transaction, newBalance: account.balance }
    });
});

export const getTransactionsByAccount = catchAsync(async (req, res, next) => {
    const transactions = await Transaction.find({ accountId: req.params.accountId, user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: { transactions }
    });
});
