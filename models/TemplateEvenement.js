import mongoose from 'mongoose';

const templateEvenementSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  jourSemaine: { type: Number, required: true }, // 0 = dimanche, 1 = lundi, ...
  heureDebut: { type: String, required: true }, // "09:00"
  dureeMinutes: { type: Number, required: true },
  lieu: { type: String, default: '' },
  type: { type: String, default: 'cours' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('TemplateEvenement', templateEvenementSchema);
