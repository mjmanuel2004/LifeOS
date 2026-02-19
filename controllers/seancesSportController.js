import SeanceSport from '../models/SeanceSport.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllSeances = catchAsync(async (req, res, next) => {
    const seances = await SeanceSport.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
        status: 'success',
        results: seances.length,
        data: { seances },
    });
});

export const createSeance = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;
    const newSeance = await SeanceSport.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { seance: newSeance },
    });
});

export const getSeance = catchAsync(async (req, res, next) => {
    const seance = await SeanceSport.findOne({ _id: req.params.id, user: req.user.id });

    if (!seance) {
        return next(new AppError('Aucune séance trouvée avec cet ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { seance },
    });
});

export const deleteSeance = catchAsync(async (req, res, next) => {
    const seance = await SeanceSport.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!seance) {
        return next(new AppError('Aucune séance trouvée avec cet ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// Seed PPL History
export const seedSeances = catchAsync(async (req, res, next) => {
    await SeanceSport.deleteMany({ user: req.user.id });

    const seeds = [
        {
            titre: "Explosion Pectoraux",
            type: "musculation",
            splitName: "PUSH",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            dureeTotale: 65,
            ressenti: 8,
            user: req.user.id,
            exercices: [
                { nom: "Développé Couché", series: 4, repetitions: "10-12", poids: 80, completed: true },
                { nom: "Dips Lestés", series: 3, repetitions: "12", poids: 10, completed: true },
                { nom: "Écarté Poulie", series: 3, repetitions: "15", poids: 15, completed: true }
            ]
        },
        {
            titre: "Dos Large & Biceps",
            type: "musculation",
            splitName: "PULL",
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            dureeTotale: 70,
            ressenti: 9,
            user: req.user.id,
            exercices: [
                { nom: "Tractions", series: 4, repetitions: "10", poids: 0, completed: true },
                { nom: "Rowing Barre", series: 3, repetitions: "12", poids: 70, completed: true },
                { nom: "Curl Marteau", series: 3, repetitions: "12", poids: 18, completed: true }
            ]
        },
        {
            titre: "Leg Day (Squat Focus)",
            type: "musculation",
            splitName: "LEGS",
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            dureeTotale: 80,
            ressenti: 10,
            user: req.user.id,
            exercices: [
                { nom: "Squat Arrière", series: 5, repetitions: "5-8", poids: 120, completed: true },
                { nom: "Presse à cuisses", series: 4, repetitions: "15", poids: 200, completed: true },
                { nom: "Leg Extension", series: 3, repetitions: "20", poids: 60, completed: true }
            ]
        }
    ];

    await SeanceSport.insertMany(seeds);

    res.status(200).json({
        status: 'success',
        message: 'PPL History Seeded',
        results: seeds.length
    });
});
