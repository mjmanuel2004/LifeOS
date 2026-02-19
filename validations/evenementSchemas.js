import { z } from 'zod';

export const createEvenementSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  debut: z.string().datetime().or(z.date()),
  fin: z.string().datetime().or(z.date()),
  lieu: z.string().optional(),
  type: z.string().optional(),
  source: z.enum(['ics', 'template', 'manual']).optional(),
  templateId: z.string().optional(),
  icsUid: z.string().optional(),
});

export const importIcsSchema = z.object({
  ics: z.string().min(1, 'Le contenu ICS est requis'),
});

export const createTemplateSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  jourSemaine: z.number().int().min(0).max(6),
  heureDebut: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:MM requis'),
  dureeMinutes: z.number().int().positive(),
  lieu: z.string().optional(),
  type: z.string().optional(),
});

export const createEventFromTemplateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')
    .optional(),
});
