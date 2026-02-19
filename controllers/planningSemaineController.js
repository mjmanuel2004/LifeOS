import PlanningSemaine from '../models/PlanningSemaine.js';
import catchAsync from '../utils/catchAsync.js';
import { getLundi } from '../utils/dateUtils.js';

export const getPlanning = catchAsync(async (req, res) => {
  const { date } = req.query; // date quelconque de la semaine
  const dateDebut = date ? getLundi(date) : getLundi(new Date());
  let plan = await PlanningSemaine.findOne({ dateDebut }).populate('slots.recetteId');
  if (!plan) {
    plan = await PlanningSemaine.create({ dateDebut, slots: [] });
  }
  res.status(200).json(plan);
});

export const updatePlanning = catchAsync(async (req, res) => {
  const { dateDebut, slots } = req.body;
  const debut = dateDebut ? new Date(dateDebut) : getLundi(new Date());
  const plan = await PlanningSemaine.findOneAndUpdate(
    { dateDebut: getLundi(debut) },
    { dateDebut: getLundi(debut), slots: slots || [] },
    { new: true, upsert: true }
  ).populate('slots.recetteId');
  res.status(200).json(plan);
});
