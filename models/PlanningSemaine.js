import mongoose from 'mongoose';

// dateDebut = lundi de la semaine (YYYY-MM-DD)
// slots: [{ jour: 0, recetteId }, ...] jour 0=lundi, 6=dimanche
const slotSchema = new mongoose.Schema(
  {
    jour: { type: Number, required: true }, // 0-6
    recetteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recette', required: true },
  },
  { _id: false }
);

const planningSemaineSchema = new mongoose.Schema({
  dateDebut: { type: Date, required: true, unique: true },
  slots: [slotSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('PlanningSemaine', planningSemaineSchema);
