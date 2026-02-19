import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    quantite: { type: String, required: true }, // "2", "1/2", "200"
    unite: { type: String, default: '' }, // "g", "cl", "cuillères", ""
  },
  { _id: false }
);

const recetteSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'], default: 'Déjeuner' },
  image: { type: String }, // URL or path
  ingredients: [ingredientSchema],
  etapes: [{ type: String }],
  dureeMinutes: { type: Number, default: null }, // Temps total
  cuissonMinutes: { type: Number, default: 0 },
  calories: { type: Number },
  proteines: { type: Number }, // g
  glucides: { type: Number }, // g
  lipides: { type: Number }, // g
  isFavorite: { type: Boolean, default: false },
  lastCooked: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model('Recette', recetteSchema);
