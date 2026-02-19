import mongoose from 'mongoose';

const depenseSchema = new mongoose.Schema({
  libelle: { type: String, required: true },
  montant: { type: Number, required: true },
  categorie: { type: String, default: 'Divers' },
  date: { type: Date, default: Date.now },
  mois: { type: Number }, // 1-12, dérivé de date si absent
  annee: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

depenseSchema.pre('save', function (next) {
  const d = this.date || new Date();
  if (this.mois == null) this.mois = d.getMonth() + 1;
  if (this.annee == null) this.annee = d.getFullYear();
  next();
});

depenseSchema.index({ annee: 1, mois: 1 });

export default mongoose.model('Depense', depenseSchema);
