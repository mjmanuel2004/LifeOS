import Tache from '../models/Tache.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllTaches = catchAsync(async (req, res) => {
  const taches = await Tache.find().sort({ createdAt: -1 });
  res.status(200).json(taches);
});

export const createTache = catchAsync(async (req, res) => {
  const newTache = await Tache.create(req.body);
  res.status(201).json(newTache);
});

export const updateTache = catchAsync(async (req, res, next) => {
  const tache = await Tache.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tache) {
    return next(new AppError('Aucune tâche trouvée avec cet ID', 404));
  }

  res.status(200).json(tache);
});

export const deleteTache = catchAsync(async (req, res, next) => {
  const tache = await Tache.findByIdAndDelete(req.params.id);

  if (!tache) {
    return next(new AppError('Aucune tâche trouvée avec cet ID', 404));
  }

  res.status(200).json({ message: 'Tâche supprimée' });
});
