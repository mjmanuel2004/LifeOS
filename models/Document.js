import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  titre: { type: String, required: true }, // ex: "Attestation C2S", "Contrat Assurance"
  categorie: {
    type: String,
    enum: ['logement', 'sante', 'etudes', 'admin', 'autre'],
    default: 'autre',
  },
  dateExpiration: { type: Date }, // Pour les rappels
  cheminFichier: { type: String }, // URL ou chemin local si uploadé (optionnel pour l'instant)
  notes: { type: String },
  dateAjout: { type: Date, default: Date.now },
});

export default mongoose.model('Document', documentSchema);
