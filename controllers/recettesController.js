import Recette from '../models/Recette.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllRecettes = catchAsync(async (req, res, next) => {
  const recettes = await Recette.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: recettes.length,
    data: { recettes },
  });
});

export const getRecette = catchAsync(async (req, res, next) => {
  const recette = await Recette.findOne({ _id: req.params.id, user: req.user.id });

  if (!recette) {
    return next(new AppError('Aucune recette trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { recette },
  });
});

export const createRecette = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const newRecette = await Recette.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { recette: newRecette },
  });
});

export const updateRecette = catchAsync(async (req, res, next) => {
  const recette = await Recette.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!recette) {
    return next(new AppError('Aucune recette trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { recette },
  });
});

export const deleteRecette = catchAsync(async (req, res, next) => {
  const recette = await Recette.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!recette) {
    return next(new AppError('Aucune recette trouvée avec cet ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Seed for Chef Master Demo
export const seedRecettes = catchAsync(async (req, res, next) => {
  await Recette.deleteMany({ user: req.user.id });

  const seeds = [
    {
      titre: "Attiéké & Poulet Braisé",
      type: "Déjeuner",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2070&auto=format&fit=crop",
      ingredients: [
        { nom: "Attiéké", quantite: "200", unite: "g" },
        { nom: "Cuisse de Poulet", quantite: "1", unite: "unité" },
        { nom: "Oignons", quantite: "2", unite: "" },
        { nom: "Tomates", quantite: "2", unite: "" }
      ],
      etapes: [
        "Mariner le poulet avec épices, moutarde, ail.",
        "Braiser le poulet au four ou barbecue.",
        "Préparer la sauce moyo (tomates/oignons cubes).",
        "Servir avec l'attiéké."
      ],
      dureeMinutes: 45,
      calories: 650,
      proteines: 45,
      glucides: 80,
      lipides: 20,
      user: req.user.id
    },
    {
      titre: "Pâtes Carbonara (Vraie)",
      type: "Dîner",
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2071&auto=format&fit=crop",
      ingredients: [
        { nom: "Spaghetti", quantite: "150", unite: "g" },
        { nom: "Guanciale (ou Lardons)", quantite: "100", unite: "g" },
        { nom: "Jaunes d'oeufs", quantite: "3", unite: "" },
        { nom: "Pecorino", quantite: "50", unite: "g" }
      ],
      etapes: [
        "Cuire les pâtes al dente.",
        "Dorer le guanciale à la poêle.",
        "Mélanger jaunes + pecorino + poivre dans un bol.",
        "Mélanger tout HORS DU FEU avec un peu d'eau de cuisson."
      ],
      dureeMinutes: 20,
      calories: 800,
      proteines: 35,
      glucides: 90,
      lipides: 35,
      user: req.user.id
    },
    {
      titre: "Bowl Saumon Avocat",
      type: "Déjeuner",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      ingredients: [
        { nom: "Riz Complet", quantite: "100", unite: "g" },
        { nom: "Pavé Saumon", quantite: "1", unite: "unité" },
        { nom: "Avocat", quantite: "1/2", unite: "" },
        { nom: "Graines Sésame", quantite: "1", unite: "pincée" }
      ],
      etapes: [
        "Cuire le riz.",
        "Couper le saumon en dés (cru ou poêlé).",
        "Couper l'avocat en lamelles.",
        "Dresser dans un bol."
      ],
      dureeMinutes: 15,
      calories: 550,
      proteines: 30,
      glucides: 45,
      lipides: 25,
      user: req.user.id
    }
  ];

  await Recette.insertMany(seeds);

  res.status(200).json({
    status: 'success',
    message: 'Visual Recipes Seeded',
    results: seeds.length
  });
});

export const generateRecette = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      recette: {
        titre: "Recette IA (Demo)",
        type: "Déjeuner",
        ingredients: [],
        etapes: ["En cours de développement"],
        dureeMinutes: 0,
        calories: 0
      }
    }
  });
});
