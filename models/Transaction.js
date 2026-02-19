import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Le montant est requis']
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Logement', 'Transport', 'Alimentation', 'Loisirs', 'Santé',
            'Education', 'Shopping', 'Services', 'Epargne', 'Salaire', 'Autre'
        ]
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    isSimulation: {
        type: Boolean,
        default: false // For Sandbox mode
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries by date and account
transactionSchema.index({ date: -1, accountId: 1 });

export default mongoose.model('Transaction', transactionSchema);
