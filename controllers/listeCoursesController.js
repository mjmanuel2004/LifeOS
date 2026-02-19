import ListeCourse from '../models/ListeCourse.js';
import PlanningSemaine from '../models/PlanningSemaine.js';
import Recette from '../models/Recette.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { getLundi } from '../utils/dateUtils.js';

export const getListe = catchAsync(async (req, res) => {
  const liste = await ListeCourse.findOne().sort({ dateGeneration: -1 });
  res.status(200).json(liste || { items: [], totalEstime: null, dateGeneration: null });
});

export const genererListe = catchAsync(async (req, res, next) => {
  const { dateDebut } = req.body;
  const debut = dateDebut ? getLundi(dateDebut) : getLundi(new Date());

  const plan = await PlanningSemaine.findOne({ dateDebut: debut });
  if (!plan || !plan.slots?.length) {
    return next(new AppError('Aucun planning pour cette semaine', 400));
  }

  const recetteIds = [...new Set(plan.slots.map((s) => s.recetteId?.toString()).filter(Boolean))];
  const recettes = await Recette.find({ _id: { $in: recetteIds } });

  const map = new Map(); // nom+unite -> { nom, quantite, unite, prix }

  for (const r of recettes) {
    for (const ing of r.ingredients || []) {
      const key = `${ing.nom}|${ing.unite || ''}`;
      if (!map.has(key)) {
        map.set(key, {
          nom: ing.nom,
          quantite: '0',
          unite: ing.unite || '',
          prix: null,
          coche: false,
        });
      }
      const existing = map.get(key);
      const q = (parseFloat(existing.quantite) || 0) + (parseFloat(ing.quantite) || 1);
      existing.quantite = String(q);
    }
  }

  const items = Array.from(map.values());
  const totalEstime = items.reduce((s, i) => s + (i.prix || 0), 0);

  const liste = await ListeCourse.create({
    items,
    dateGeneration: new Date(),
    totalEstime: totalEstime || null,
    sourcePlanningId: plan._id,
  });

  res.status(201).json(liste);
});

export const updateListe = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  // Logic from original route: if id exists update, else find latest.
  // But wait, the original code had a weird logic:
  // "const liste = id ? await findById... : await findOne().sort..."
  // And "if (!liste && !id) create new".

  let liste;

  if (id) {
    liste = await ListeCourse.findByIdAndUpdate(id, req.body, { new: true });
    if (!liste) return next(new AppError('Liste introuvable', 404));
  } else {
    // Try to find the latest
    liste = await ListeCourse.findOne().sort({ dateGeneration: -1 });

    // If no list found and no ID provided, create a new one
    if (!liste) {
      const newListe = await ListeCourse.create({
        items: req.body.items || [],
        totalEstime: req.body.totalEstime,
      });
      return res.status(200).json(newListe);
    }

    // If list found, update it (mimicking original behavior which seems to imply updating the *latest* list if no ID provided)
    if (req.body.items) liste.items = req.body.items;
    if (req.body.totalEstime != null) liste.totalEstime = req.body.totalEstime;
    await liste.save();
  }

  res.status(200).json(liste);
});

export const toggleItem = catchAsync(async (req, res, next) => {
  const liste = await ListeCourse.findById(req.params.id);
  if (!liste) {
    return next(new AppError('Liste introuvable', 404));
  }
  const idx = parseInt(req.params.index, 10);
  if (liste.items[idx]) {
    liste.items[idx].coche = !!req.body.coche;
  }
  await liste.save();
  res.status(200).json(liste);
});
