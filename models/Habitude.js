import mongoose from 'mongoose';

const habitudeSchema = new mongoose.Schema({
  titre: { type: String, required: true }, // ex: "Boire 2L d'eau", "Lire 30min"
  frequence: { type: String, enum: ['quotidien', 'hebdomadaire'], default: 'quotidien' },
  objectif: { type: Number, default: 1 }, // Combien de fois par jour/semaine
  unite: { type: String }, // ex: "verres", "pages", "minutes"
  historique: [
    {
      date: { type: Date, default: Date.now },
      valeur: { type: Number, default: 0 }, // Valeur atteinte ce jour-là
      estComplete: { type: Boolean, default: false },
    },
  ],
  couleur: { type: String, default: '#3B82F6' },
  dateCreation: { type: Date, default: Date.now },
});

export default mongoose.model('Habitude', habitudeSchema);
