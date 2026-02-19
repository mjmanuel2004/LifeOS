import mongoose from 'mongoose';

const tacheSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, default: '' },
  terminee: { type: Boolean, default: false },
  dateEcheance: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Tache', tacheSchema);
