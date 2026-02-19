import { z } from 'zod';

export const createDepenseSchema = z.object({
  libelle: z.string().min(1, 'Le libellé est requis'),
  montant: z.number().positive('Le montant doit être positif'),
  categorie: z.string().optional(),
  date: z.string().datetime().optional().or(z.date().optional()),
  mois: z.number().int().min(1).max(12).optional(),
  annee: z.number().int().min(2000).max(2100).optional(),
});

export const createRevenuSchema = z.object({
  libelle: z.string().min(1, 'Le libellé est requis'),
  montant: z.number().positive('Le montant doit être positif'),
  mois: z.number().int().min(1).max(12),
  annee: z.number().int().min(2000).max(2100),
});
