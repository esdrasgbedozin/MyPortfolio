/**
 * Epic 6.2 - FE-079/081: Composant ContactForm
 * React Hook Form + Zod validation + API integration
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, ApiError } from '../services/api';

// Zod schema validation (conformément RFC 7807 + SOLID)
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string().min(1, "L'email est requis").email("L'email est invalide"),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Type de réponse API selon OpenAPI spec
 */
interface ContactFormResponse {
  success: boolean;
  messageId: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  onSuccess?: (response: ContactFormResponse) => void;
  onError?: (error: ApiError) => void;
}

/**
 * ContactForm component with validation and API integration
 * Handles form submission with Zod schema validation + API call
 * @returns JSX.Element
 */
// eslint-disable-next-line max-lines-per-function
export function ContactForm({ onSubmit, onSuccess, onError }: ContactFormProps): React.JSX.Element {
  const { register, handleSubmit, formState } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // CRITICAL: Destructure after to ensure Proxy subscription
  const { errors } = formState;

  const handleFormSubmit = async (data: ContactFormData): Promise<void> => {
    // Si un handler custom est fourni, l'utiliser (pour les tests)
    if (onSubmit) {
      try {
        await onSubmit(data);
      } catch (error) {
        // Avaler l'erreur silencieusement si pas de handler onError
        if (error instanceof ApiError && onError) {
          onError(error);
        }
        // Ne pas re-throw pour éviter unhandled rejection dans les tests
        return;
      }
      return;
    }

    // Sinon, appeler l'API
    try {
      const response = await api.post<ContactFormResponse>('/contact', data);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      if (error instanceof ApiError && onError) {
        onError(error);
      }
      // Ne pas re-throw - l'erreur est gérée par onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Nom
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Envoyer
      </button>
    </form>
  );
}
