import { z } from 'zod';

export const createTacheSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  terminee: z.boolean().optional(),
  dateEcheance: z.string().datetime().optional().or(z.date().optional()), // Accepts ISO string or Date object
});

export const updateTacheSchema = createTacheSchema.partial();
