/**
 * @fileoverview Schema de validation Zod pour le formulaire de contact
 * @module schemas/contactSchema
 * @epic Epic 2.1 - ValidationService TDD
 * @task EF-011 - Implémenter schema Zod contact (GREEN)
 */

import { z } from 'zod';

/**
 * Schema de validation pour le formulaire de contact
 *
 * Règles de validation :
 * - name: 1-100 caractères, trimé, requis
 * - email: format email valide, lowercased, trimé, requis
 * - message: 10-2000 caractères, trimé, requis
 *
 * Transformations automatiques :
 * - Trim whitespace (name, email, message)
 * - Lowercase email
 *
 * @see {@link https://zod.dev/ | Zod Documentation}
 * @see {@link /openapi.yaml#/components/schemas/ContactFormRequest | OpenAPI Spec}
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Le nom ne peut pas être vide' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' }),

  email: z.string().trim().toLowerCase().email({ message: 'Format email invalide' }),

  message: z
    .string()
    .trim()
    .min(10, { message: 'Le message doit contenir au moins 10 caractères' })
    .max(2000, { message: 'Le message ne peut pas dépasser 2000 caractères' }),
});

/**
 * Type TypeScript inféré depuis le schema Zod
 *
 * Garantit la cohérence entre validation et types.
 *
 * @example
 * ```typescript
 * const formData: ContactFormData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello world!'
 * };
 * ```
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;
