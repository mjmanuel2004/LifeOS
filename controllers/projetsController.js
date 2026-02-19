import Projet from '../models/Projet.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllProjets = catchAsync(async (req, res, next) => {
    const projets = await Projet.find().sort({ dateDebut: -1 });

    res.status(200).json({
        status: 'success',
        results: projets.length,
        data: { projets },
    });
});

export const createProjet = catchAsync(async (req, res, next) => {
    const newProjet = await Projet.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { projet: newProjet },
    });
});

export const getProjet = catchAsync(async (req, res, next) => {
    const projet = await Projet.findById(req.params.id);

    if (!projet) {
        return next(new AppError('Aucun projet trouvé avec cet ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { projet },
    });
});

export const updateProjet = catchAsync(async (req, res, next) => {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!projet) {
        return next(new AppError('Aucun projet trouvé avec cet ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { projet },
    });
});

export const deleteProjet = catchAsync(async (req, res, next) => {
    const projet = await Projet.findByIdAndDelete(req.params.id);

    if (!projet) {
        return next(new AppError('Aucun projet trouvé avec cet ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// Seed Dynamic Projects
export const seedProjets = catchAsync(async (req, res, next) => {
    await Projet.deleteMany({});

    const seeds = [
        {
            titre: "LifeOS App V1",
            description: "Développement de l'application de gestion personnelle ultime.",
            categorie: "perso",
            statut: "actif",
            couleur: "#3B82F6", // Blue
            taches: [
                { titre: "Phase 12: Data Architecture", statut: "termine" },
                { titre: "Phase 13: Cuisine Redesign", statut: "termine" },
                { titre: "Phase 14: Dynamic Projects", statut: "en_cours" }
            ]
        },
        {
            titre: "Voyage Japon 2026",
            description: "Préparation du voyage d'un mois à Tokyo et Kyoto.",
            categorie: "perso",
            statut: "actif",
            couleur: "#EC4899", // Pink
            taches: [
                { titre: "Acheter Billets", statut: "termine" },
                { titre: "Réserver Ryokan Kyoto", statut: "a_faire" },
                { titre: "Liste itinéraire", statut: "en_cours" }
            ]
        },
        {
            titre: "Master MIAGE",
            description: "Suivi des cours et projets universitaires.",
            categorie: "etudes",
            statut: "actif",
            couleur: "#10B981", // Emerald
            taches: [
                { titre: "Rendu Projet Web", statut: "a_faire", dateLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
                { titre: "Réviser Partiels", statut: "a_faire" }
            ]
        }
    ];

    await Projet.insertMany(seeds);

    res.status(200).json({
        status: 'success',
        message: 'Projects Seeded',
        results: seeds.length
    });
});
