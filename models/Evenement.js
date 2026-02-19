import mongoose from 'mongoose';

const evenementSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  debut: { type: Date, required: true },
  fin: { type: Date, required: true },
  lieu: { type: String, default: '' },
  type: { type: String, default: 'cours' }, // cours, td, exam, perso...
  source: { type: String, enum: ['ics', 'template', 'manual'], default: 'manual' },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateEvenement', default: null },
  icsUid: { type: String, default: null }, // id événement dans le .ics
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

evenementSchema.index({ debut: 1 });

export default mongoose.model('Evenement', evenementSchema);
