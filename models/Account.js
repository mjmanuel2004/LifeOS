import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du compte est requis'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Principal', 'Quotidien', 'Épargne', 'Investissement', 'Cash'],
        default: 'Principal'
    },
    balance: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: 'from-slate-500/20 to-slate-900/40' // Gradient class for UI
    },
    lastSync: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Account', accountSchema);
