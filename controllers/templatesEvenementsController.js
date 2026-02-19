import TemplateEvenement from '../models/TemplateEvenement.js';
import Evenement from '../models/Evenement.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllTemplates = catchAsync(async (req, res) => {
  const templates = await TemplateEvenement.find().sort({
    jourSemaine: 1,
    heureDebut: 1,
  });
  res.status(200).json(templates);
});

export const createTemplate = catchAsync(async (req, res) => {
  const template = await TemplateEvenement.create(req.body);
  res.status(201).json(template);
});

export const creerEvenementDepuisTemplate = catchAsync(async (req, res, next) => {
  const template = await TemplateEvenement.findById(req.params.id);
  if (!template) {
    return next(new AppError('Template introuvable', 404));
  }
  const { date } = req.body; // YYYY-MM-DD
  const d = date ? new Date(date) : new Date();
  const [h, m] = (template.heureDebut || '09:00').split(':').map(Number);
  const debut = new Date(d);
  const diff = (template.jourSemaine - d.getDay() + 7) % 7;
  debut.setDate(debut.getDate() + diff);
  debut.setHours(h, m || 0, 0, 0);
  const fin = new Date(debut);
  fin.setMinutes(fin.getMinutes() + (template.dureeMinutes || 60));
  const evenement = await Evenement.create({
    titre: template.titre,
    debut,
    fin,
    lieu: template.lieu,
    type: template.type,
    source: 'template',
    templateId: template._id,
  });
  res.status(201).json(evenement);
});

export const deleteTemplate = catchAsync(async (req, res, next) => {
  const t = await TemplateEvenement.findByIdAndDelete(req.params.id);
  if (!t) {
    return next(new AppError('Template introuvable', 404));
  }
  res.status(200).json({ message: 'Template supprimé' });
});
