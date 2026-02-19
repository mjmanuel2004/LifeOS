import mongoose from 'mongoose';

const itemCourseSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    quantite: { type: String, default: '1' },
    unite: { type: String, default: '' },
    prix: { type: Number, default: null }, // optionnel, pour total et lien Budget
    coche: { type: Boolean, default: false },
  },
  { _id: false }
);

const listeCourseSchema = new mongoose.Schema({
  items: [itemCourseSchema],
  dateGeneration: { type: Date, default: Date.now },
  totalEstime: { type: Number, default: null }, // somme des prix → envoyé au module Budget (simulateur)
  sourcePlanningId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanningSemaine', default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ListeCourse', listeCourseSchema);
