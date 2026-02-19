/**
 * Epic 6.2 - FE-079/081/082/083: Composant ContactForm
 * React Hook Form + Zod validation + API integration + UI states + Turnstile
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Turnstile } from '@marsidev/react-turnstile';
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
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Cloudflare Turnstile test sitekey (always passes)
 * Prod: use PUBLIC_TURNSTILE_SITE_KEY from env
 */
const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

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
 * État de soumission du formulaire
 */
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * ContactForm component with validation, API integration and UI states
 * Handles form submission with Zod schema validation + API call + loading/success/error states
 * @returns JSX.Element
 */
// eslint-disable-next-line max-lines-per-function
export function ContactForm({ onSubmit, onSuccess, onError }: ContactFormProps): React.JSX.Element {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const { register, handleSubmit, formState, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // CRITICAL: Destructure after to ensure Proxy subscription
  const { errors } = formState;

  const handleFormSubmit = async (data: ContactFormData): Promise<void> => {
    // Reset messages et set loading
    setStatus('loading');
    setErrorMessage('');
    setSuccessMessage('');

    // Si un handler custom est fourni, l'utiliser (pour les tests)
    if (onSubmit) {
      try {
        await onSubmit(data);
        setStatus('success');
        setSuccessMessage('Message envoyé avec succès !');
        reset(); // Clear form après succès
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
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
      const response = await api.post<ContactFormResponse>('/contact', {
        ...data,
        turnstileToken, // Include Turnstile token in API request
      });

      setStatus('success');
      setSuccessMessage(response.message || 'Votre message a été envoyé avec succès !');
      reset(); // Clear form après succès
      setTurnstileToken(''); // Reset Turnstile token

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      setStatus('error');

      if (error instanceof ApiError) {
        // Gérer les différents codes d'erreur
        if (error.status === 429) {
          setErrorMessage('Trop de requêtes. Veuillez réessayer dans quelques minutes.');
        } else if (error.status === 400) {
          setErrorMessage('Données invalides. Veuillez vérifier le formulaire.');
        } else if (error.status === 403) {
          setErrorMessage('Vérification anti-spam échouée. Veuillez réessayer.');
        } else {
          setErrorMessage(error.message || "Erreur lors de l'envoi du message.");
        }

        if (onError) {
          onError(error);
        }
      } else {
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Success Message */}
      {status === 'success' && (
        <div
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <p className="text-green-800 text-sm font-medium">✓ {successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-red-800 text-sm font-medium">✗ {errorMessage}</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Nom
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Cloudflare Turnstile */}
      <div className="flex justify-center">
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken('')}
          onExpire={() => setTurnstileToken('')}
          options={{
            theme: 'light',
            size: 'normal',
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading' || !turnstileToken}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Envoi en cours...</span>
          </>
        ) : (
          'Envoyer'
        )}
      </button>
    </form>
  );
}
