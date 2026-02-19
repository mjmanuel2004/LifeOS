import * as aiService from '../services/aiService.js';
import catchAsync from '../utils/catchAsync.js';

export const getFinancialAnalysis = catchAsync(async (req, res) => {
    const { month, year } = req.body;

    if (!month || !year) {
        return res.status(400).json({
            status: 'fail',
            message: 'Veuillez fournir le mois et l\'année.',
        });
    }

    // Pour l'instant, pas de userId géré (MVP sans auth complexe)
    const analysis = await aiService.analyzeFinancialData('user-id-placeholder', month, year);

    res.status(200).json({
        status: 'success',
        data: analysis,
    });
});

import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js'; // Assuming we want recent tx
import SeanceSport from '../models/SeanceSport.js';
import Evenement from '../models/Evenement.js';
import Projet from '../models/Projet.js';

export const getLifeContextAdvice = catchAsync(async (req, res) => {
    const { prompt } = req.body; // Optional user prompt

    // 1. Gather Data Snapshot (Parallel for speed)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [accounts, recentTransactions, lastWorkouts, nextEvents, activeProjects] = await Promise.all([
        Account.find().select('name balance type'),
        Transaction.find({ date: { $gte: lastWeek } }).sort({ date: -1 }).limit(5).select('title amount type category'),
        SeanceSport.find().sort({ date: -1 }).limit(3).select('titre splitName date ressenti'),
        Evenement.find({ debut: { $gte: today, $lte: new Date(today.getTime() + 48 * 60 * 60 * 1000) } }).sort({ debut: 1 }),
        Projet.find({ statut: 'actif' }).select('titre dateLimite taches')
    ]);

    // 2. Synthesize Context object
    const totalLiquidity = accounts
        .filter(a => ['Principal', 'Quotidien', 'Cash'].includes(a.type))
        .reduce((sum, a) => sum + a.balance, 0);

    const context = {
        timestamp: new Date().toISOString(),
        finance: {
            totalLiquidity,
            accounts: accounts.map(a => `${a.name}: ${a.balance}€`),
            recentSpending: recentTransactions.map(t => `${t.title} (${t.amount}€)`),
        },
        health: {
            lastWorkout: lastWorkouts[0] ? `${lastWorkouts[0].titre} (${lastWorkouts[0].splitName}) le ${lastWorkouts[0].date}` : "Aucune séance récente",
            workoutCountLastWeek: lastWorkouts.filter(w => new Date(w.date) > lastWeek).length
        },
        calendar: {
            nextEvents: nextEvents.map(e => `${e.titre} à ${new Date(e.debut).toLocaleTimeString()} (${e.type})`),
            isBusyToday: nextEvents.filter(e => new Date(e.debut).getDate() === today.getDate()).length > 2
        },
        work: {
            activeProjectsCount: activeProjects.length,
            urgentProjects: activeProjects.filter(p => p.dateLimite && new Date(p.dateLimite) < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).map(p => p.titre)
        }
    };

    // 3. Ask Gemini
    const advice = await aiService.analyzeLifeContext(context, prompt);

    res.status(200).json({
        status: 'success',
        data: advice
    });
});
