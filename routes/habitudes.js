import express from 'express';
import Habitude from '../models/Habitude.js';

const router = express.Router();

// GET toutes les habitudes
router.get('/', async (req, res) => {
  try {
    const habitudes = await Habitude.find().sort({ dateCreation: -1 });
    res.json(habitudes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST nouvelle habitude
router.post('/', async (req, res) => {
  const habitude = new Habitude(req.body);
  try {
    const nouvelleHabitude = await habitude.save();
    res.status(201).json(nouvelleHabitude);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH mise à jour (ex: cocher une case pour aujourd'hui)
router.patch('/:id/check', async (req, res) => {
  try {
    const { date, valeur } = req.body;
    const habitude = await Habitude.findById(req.params.id);

    // Logique simple : ajouter ou mettre à jour l'entrée d'historique pour cette date
    // (À affiner selon besoin réel)
    const existingEntryIndex = habitude.historique.findIndex(
      (h) => new Date(h.date).toDateString() === new Date(date).toDateString()
    );

    if (existingEntryIndex >= 0) {
      habitude.historique[existingEntryIndex].valeur = valeur;
      habitude.historique[existingEntryIndex].estComplete = valeur >= habitude.objectif;
    } else {
      habitude.historique.push({
        date: date,
        valeur: valeur,
        estComplete: valeur >= habitude.objectif,
      });
    }

    const updatedHabitude = await habitude.save();
    res.json(updatedHabitude);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
