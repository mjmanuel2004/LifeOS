import express from 'express';
import Document from '../models/Document.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().sort({ dateAjout: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const document = new Document(req.body);
  try {
    const nouveauDocument = await document.save();
    res.status(201).json(nouveauDocument);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
