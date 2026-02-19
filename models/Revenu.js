import mongoose from 'mongoose';

const revenuSchema = new mongoose.Schema({
  libelle: { type: String, required: true },
  montant: { type: Number, required: true },
  mois: { type: Number, required: true }, // 1-12
  annee: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Revenu', revenuSchema);
