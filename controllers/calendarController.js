import Evenement from '../models/Evenement.js';
import Tache from '../models/Tache.js';
import PlanningSemaine from '../models/PlanningSemaine.js';
import SeanceSport from '../models/SeanceSport.js';
import catchAsync from '../utils/catchAsync.js';

export const getCalendarItems = catchAsync(async (req, res) => {
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = end ? new Date(end) : new Date(new Date().setDate(new Date().getDate() + 30));

    const [evenements, taches, plannings, sports] = await Promise.all([
        Evenement.find({ debut: { $gte: startDate, $lte: endDate } }),
        Tache.find({ dateEcheance: { $gte: startDate, $lte: endDate }, terminee: false }),
        PlanningSemaine.find({
            'jours.date': { $gte: startDate, $lte: endDate }
        }).populate('jours.dejeuner.recette jours.diner.recette'),
        SeanceSport.find({ date: { $gte: startDate, $lte: endDate } })
    ]);

    const items = [];

    // 1. Events
    evenements.forEach(ev => {
        items.push({
            id: ev._id,
            title: ev.titre,
            start: ev.debut,
            end: ev.fin,
            type: 'event',
            color: '#3b82f6', // blue-500
            details: { lieu: ev.lieu, type: ev.type }
        });
    });

    // 2. Tasks (mapped to all day)
    taches.forEach(t => {
        items.push({
            id: t._id,
            title: `Task: ${t.titre}`,
            start: t.dateEcheance,
            allDay: true,
            type: 'task',
            color: '#10b981', // green-500
            details: { priority: t.priority }
        });
    });

    // 3. Meals form PlanningSemaine
    plannings.forEach(p => {
        p.jours.forEach(jour => {
            if (new Date(jour.date) >= startDate && new Date(jour.date) <= endDate) {
                if (jour.dejeuner?.recette) {
                    items.push({
                        id: `meal-d-${jour._id}`,
                        title: `🍽️ ${jour.dejeuner.recette.titre}`,
                        start: jour.date, // Lunch time approx? Or all day
                        allDay: true,
                        type: 'meal',
                        color: '#f59e0b', // amber-500
                        details: { type: 'Déjeuner' }
                    });
                }
                if (jour.diner?.recette) {
                    items.push({
                        id: `meal-n-${jour._id}`,
                        title: `🌙 ${jour.diner.recette.titre}`,
                        start: jour.date,
                        allDay: true,
                        type: 'meal',
                        color: '#f97316', // orange-500
                        details: { type: 'Dîner' }
                    });
                }
            }
        });
    });

    // 4. Sport
    sports.forEach(s => {
        items.push({
            id: s._id,
            title: `💪 ${s.titre}`,
            start: s.date,
            end: new Date(new Date(s.date).getTime() + (s.duree * 60000)),
            type: 'sport',
            color: '#8b5cf6', // violet-500
            details: { type: s.type }
        });
    });

    res.status(200).json(items);
});

export const createEvent = catchAsync(async (req, res) => {
    const event = await Evenement.create(req.body);
    res.status(201).json(event);
});

export const createTask = catchAsync(async (req, res) => {
    const task = await Tache.create(req.body);
    res.status(201).json(task);
});
