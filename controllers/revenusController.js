import Revenu from '../models/Revenu.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllRevenus = catchAsync(async (req, res) => {
  const { mois, annee } = req.query;
  const filter = { user: req.user.id };
  if (mois) filter.mois = parseInt(mois, 10);
  if (annee) filter.annee = parseInt(annee, 10);

  const revenus = await Revenu.find(filter).sort({ createdAt: -1 });
  res.status(200).json(revenus);
});

export const createRevenu = catchAsync(async (req, res) => {
  req.body.user = req.user.id;
  const revenu = await Revenu.create(req.body);
  res.status(201).json(revenu);
});

export const deleteRevenu = catchAsync(async (req, res, next) => {
  const revenu = await Revenu.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!revenu) {
    return next(new AppError('Revenu introuvable', 404));
  }

  res.status(200).json({ message: 'Revenu supprimé' });
});
