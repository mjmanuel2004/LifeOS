import mongoose from 'mongoose';

const tacheProjetSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  statut: { type: String, enum: ['a_faire', 'en_cours', 'termine'], default: 'a_faire' },
  dateLimite: { type: Date },
});

const projetSchema = new mongoose.Schema({
  titre: { type: String, required: true }, // ex: "MAISON Makara", "TP MIAGE"
  description: { type: String },
  categorie: { type: String, enum: ['etudes', 'business', 'perso'], default: 'perso' },
  statut: { type: String, enum: ['actif', 'en_pause', 'termine'], default: 'actif' },
  dateDebut: { type: Date, default: Date.now },
  dateFinPrevue: { type: Date },
  taches: [tacheProjetSchema], // Mini-Kanban interne ou lien vers Taches globales
  couleur: { type: String, default: '#10B981' },
});

export default mongoose.model('Projet', projetSchema);
