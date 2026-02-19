import mongoose from 'mongoose';

const humeurSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, unique: true }, // Une entrée par jour idéalement
  niveau: { type: Number, min: 1, max: 5, required: true }, // 1: Très mauvais, 5: Excellent
  tags: [{ type: String }], // ex: "Fatigué", "Motivé", "Stressé"
  note: { type: String }, // Journal rapide
});

export default mongoose.model('Humeur', humeurSchema);
