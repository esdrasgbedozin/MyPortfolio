import { z } from 'zod';
import { contactFormSchema } from '../services/contactValidation';

/**
 * Type inféré depuis le schema Zod pour les données du formulaire de contact
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Type pour le résultat de validation réussie
 */
export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

/**
 * Type pour le résultat de validation échouée
 */
export type ValidationError = {
  success: false;
  error: z.ZodError;
};

/**
 * Type générique pour le résultat de validation
 */
export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;
