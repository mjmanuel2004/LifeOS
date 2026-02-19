import Evenement from '../models/Evenement.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllEvenements = catchAsync(async (req, res, next) => {
  const evenements = await Evenement.find({ user: req.user.id }).sort({ debut: 1 });

  res.status(200).json({
    status: 'success',
    results: evenements.length,
    data: { evenements },
  });
});

export const createEvenement = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const newEvenement = await Evenement.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { evenement: newEvenement },
  });
});

export const getProchainEvenement = catchAsync(async (req, res, next) => {
  const prochain = await Evenement.findOne({ user: req.user.id, debut: { $gte: new Date() } }).sort({ debut: 1 });

  res.status(200).json({
    status: 'success',
    data: prochain  // Return object directly or standardized structure. 
    // Frontend expects `prochainCours` structure. Let's return the object.
    // If api.js expects { data: { evenement } } or just the object?
    // Usually standard response is { status, data: { ... } }
    // Let's stick to standard and frontend might need adjustment if it expects flat.
    // Dashboard.jsx: `setProchainCours(cours)`. api.js returns `res.data` usually?
  });
});

export const getEvenement = catchAsync(async (req, res, next) => {
  const evenement = await Evenement.findOne({ _id: req.params.id, user: req.user.id });

  if (!evenement) {
    return next(new AppError('Aucun événement trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { evenement },
  });
});

export const updateEvenement = catchAsync(async (req, res, next) => {
  const evenement = await Evenement.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!evenement) {
    return next(new AppError('Aucun événement trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { evenement },
  });
});

export const deleteEvenement = catchAsync(async (req, res, next) => {
  const evenement = await Evenement.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!evenement) {
    return next(new AppError('Aucun événement trouvé avec cet ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Seed Events
export const seedEvenements = catchAsync(async (req, res, next) => {
  await Evenement.deleteMany({ user: req.user.id });

  const today = new Date();
  const seeds = [
    {
      titre: "Dentiste",
      debut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
      fin: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
      lieu: "Centre Ville",
      type: "rdv",
      couleur: "#3B82F6",
      user: req.user.id
    },
    {
      titre: "Anniversaire Sarah",
      debut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 19, 0),
      fin: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 23, 0),
      lieu: "Le Petit Restaurant",
      type: "loisir",
      couleur: "#EC4899",
      user: req.user.id
    },
    {
      titre: "Réunion Projet LifeOS",
      debut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
      fin: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
      lieu: "Bureau",
      type: "travail",
      couleur: "#10B981",
      user: req.user.id
    },
    {
      titre: "Match de Tennis",
      debut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 18, 0),
      fin: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 20, 0),
      lieu: "Club Sportif",
      type: "sport",
      couleur: "#F59E0B",
      user: req.user.id
    }
  ];

  await Evenement.insertMany(seeds);

  res.status(200).json({
    status: 'success',
    message: 'Events Seeded',
    results: seeds.length
  });
});

export const importIcs = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Import ICS not yet implemented'
  });
});
