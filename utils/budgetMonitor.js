import Notification from '../models/Notification.js';
import Depense from '../models/Depense.js';
import Revenu from '../models/Revenu.js';

export const checkBudgetHealth = async (mois, annee, userId) => {
    const [totalRevenusResult, totalDepensesResult] = await Promise.all([
        Revenu.aggregate([
            { $match: { mois, annee, user: userId } },
            { $group: { _id: null, total: { $sum: '$montant' } } },
        ]),
        Depense.aggregate([
            { $match: { mois, annee, user: userId } },
            { $group: { _id: null, total: { $sum: '$montant' } } },
        ]),
    ]);

    const totalRevenus = totalRevenusResult[0]?.total || 0;
    const totalDepenses = totalDepensesResult[0]?.total || 0;

    if (totalRevenus === 0) return; // Pas de budget défini

    const ratio = totalDepenses / totalRevenus;

    if (ratio > 1.0) {
        await createNotificationIfNeeded(
            'budget_alert',
            `Attention ! Vous avez dépassé votre budget du mois (${(ratio * 100).toFixed(0)}%).`,
            { mois: mois.toString(), annee: annee.toString(), type: 'overrun' },
            userId
        );
    } else if (ratio > 0.9) {
        await createNotificationIfNeeded(
            'budget_alert',
            `Attention ! Vous avez consommé 90% de votre budget.`,
            { mois: mois.toString(), annee: annee.toString(), type: 'warning_90' },
            userId
        );
    }
};

const createNotificationIfNeeded = async (type, message, metadata, userId) => {
    // Check if similar notification already exists for this month/context to avoid spam
    const exists = await Notification.findOne({
        type,
        'metadata.mois': metadata.mois,
        'metadata.annee': metadata.annee,
        'metadata.type': metadata.type,
        read: false,
        user: userId
    });

    if (!exists) {
        await Notification.create({ type, message, metadata, user: userId });
    }
};
