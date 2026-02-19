import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    unit: {
        type: String,
        default: 'unité' // g, kg, L, unité
    },
    category: {
        type: String,
        enum: ['Viande/Poisson', 'Laitage', 'Légume/Fruit', 'Epicerie', 'Boisson', 'Autre'],
        default: 'Autre'
    },
    expiryDate: {
        type: Date
    },
    minThreshold: {
        type: Number,
        default: 0 // If stock drops below this, suggest buying
    }
}, {
    timestamps: true
});

export default mongoose.model('Stock', stockSchema);
