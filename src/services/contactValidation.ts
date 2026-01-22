import { z } from 'zod';
import type { ValidationResult, ContactFormData } from '../types/contact';

/**
 * Schema de validation pour le formulaire de contact
 *
 * Règles de validation:
 * - name: requis, min 1 caractère après trim
 * - email: requis, format email valide
 * - message: requis, entre 10 et 2000 caractères
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis'),

  email: z.string().trim().email('Format email invalide'),

  message: z
    .string()
    .trim()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});

/**
 * Fonction de validation du formulaire de contact
 *
 * @param data - Données du formulaire à valider
 * @returns Résultat de la validation (success + data ou error)
 */
export function validateContactForm(data: unknown): ValidationResult<ContactFormData> {
  return contactFormSchema.safeParse(data);
}
