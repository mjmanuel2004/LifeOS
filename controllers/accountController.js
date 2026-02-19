import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// Get all accounts with calculated balance
export const getAccounts = catchAsync(async (req, res, next) => {
    const accounts = await Account.find({ user: req.user.id });

    // Optional: Recalculate balance from transactions if we want strict consistency
    // For now, we trust the Account.balance field which is updated on transactions

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: { accounts }
    });
});

export const createAccount = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;
    const newAccount = await Account.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { account: newAccount }
    });
});

export const updateAccount = catchAsync(async (req, res, next) => {
    const account = await Account.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!account) {
        return next(new AppError('No account found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { account }
    });
});

// Seed/Reset for Demo
export const syncSimulatedAccounts = catchAsync(async (req, res, next) => {
    // Delete existing demo accounts
    await Account.deleteMany({ user: req.user.id });

    const accounts = await Account.insertMany([
        { name: 'Compte Principal', type: 'Principal', balance: 1450.50, color: 'from-blue-600 to-blue-900', user: req.user.id },
        { name: 'Revolut', type: 'Quotidien', balance: 42.10, color: 'from-fuchsia-600 to-purple-900', user: req.user.id },
        { name: 'Livret A', type: 'Épargne', balance: 12000, color: 'from-emerald-600 to-teal-900', user: req.user.id },
        { name: 'PEA', type: 'Investissement', balance: 4500.80, color: 'from-amber-500 to-orange-700', user: req.user.id }
    ]);

    res.status(200).json({
        status: 'success',
        message: 'Accounts re-synced with bank data',
        data: { accounts }
    });
});
