import mongoose from 'mongoose';

const exerciceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  series: { type: Number, default: 3 },
  repetitions: { type: String, default: "10-12" }, // String to allow "12, 10, 8"
  poids: { type: Number, default: 0 }, // en kg
  duree: { type: Number }, // en minutes (pour cardio)
  completed: { type: Boolean, default: false },
  notes: { type: String },
});

const seanceSportSchema = new mongoose.Schema({
  titre: { type: String, required: true }, // ex: "Séance Pectoraux", "Jogging"
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['musculation', 'cardio', 'flexibilite', 'sport_collectif', 'autre'],
    required: true,
  },
  splitName: {
    type: String,
    enum: ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'FULL_BODY', 'CARDIO', 'OTHER'],
    default: 'OTHER'
  },
  dureeTotale: { type: Number }, // en minutes
  exercices: [exerciceSchema],
  ressenti: { type: Number, min: 1, max: 10 }, // Difficulté/Forme
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model('SeanceSport', seanceSportSchema);
