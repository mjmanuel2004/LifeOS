import { z } from 'zod';

// Recettes
const ingredientSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  quantite: z.string().min(1, 'La quantité est requise'),
  unite: z.string().optional(),
});

export const createRecetteSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  ingredients: z.array(ingredientSchema).optional(),
  etapes: z.array(z.string()).optional(),
  dureeMinutes: z.number().positive().optional(),
});

export const updateRecetteSchema = createRecetteSchema.partial();

// Planning Semaine
const slotSchema = z.object({
  jour: z.number().int().min(0).max(6),
  recetteId: z.string().min(1, "L'ID de la recette est requis"),
});

export const updatePlanningSchema = z.object({
  dateDebut: z.string().datetime().or(z.date()).optional(),
  slots: z.array(slotSchema),
});

// Liste Courses
const itemCourseSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  quantite: z.string().optional(),
  unite: z.string().optional(),
  prix: z.number().nullable().optional(),
  coche: z.boolean().optional(),
});

export const generateListeSchema = z.object({
  dateDebut: z.string().datetime().or(z.date()).optional(),
});

export const updateListeSchema = z.object({
  items: z.array(itemCourseSchema).optional(),
  totalEstime: z.number().nullable().optional(),
});

export const toggleItemSchema = z.object({
  coche: z.boolean(),
});
