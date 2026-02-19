import express from 'express';
import Humeur from '../models/Humeur.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const humeurs = await Humeur.find().sort({ date: -1 });
    res.json(humeurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const humeur = new Humeur(req.body);
  try {
    const nouvelleHumeur = await humeur.save();
    res.status(201).json(nouvelleHumeur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
