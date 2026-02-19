import Depense from '../models/Depense.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const scanTicket = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Veuillez fournir une image de ticket.', 400));
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyse ce ticket de caisse et extrais les informations suivantes en JSON strictement :
      - montant (number)
      - date (string YYYY-MM-DD, si absente utiliser date du jour)
      - libelle (string, nom du commerçant/magasin)
      - categorie (string, choisis parmi : Alimentation, Transport, Logement, Loisirs, Divers)

      Réponds UNIQUEMENT avec le JSON, pas de markdown.
    `;

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(jsonString);

    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error('Scan Error:', error);
    return next(new AppError('Impossible d\'analyser le ticket.', 500));
  }
});

export const getAllDepenses = catchAsync(async (req, res) => {
  const { mois, annee } = req.query;
  const filter = { user: req.user.id };
  if (mois) filter.mois = parseInt(mois, 10);
  if (annee) filter.annee = parseInt(annee, 10);

  const depenses = await Depense.find(filter).sort({ date: -1 });
  res.status(200).json(depenses);
});

import { checkBudgetHealth } from '../utils/budgetMonitor.js';

export const createDepense = catchAsync(async (req, res) => {
  req.body.user = req.user.id;
  const depense = await Depense.create(req.body);

  // Check budget health asynchronously
  checkBudgetHealth(depense.mois, depense.annee, req.user.id).catch(err => console.error('Budget Check Error:', err));

  res.status(201).json(depense);
});

export const deleteDepense = catchAsync(async (req, res, next) => {
  const depense = await Depense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!depense) {
    return next(new AppError('Dépense introuvable', 404));
  }

  res.status(200).json({ message: 'Dépense supprimée' });
});
