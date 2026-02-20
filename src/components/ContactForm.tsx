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
const createContactFormSchema = (
  locale: 'fr' | 'en' = 'fr'
): z.ZodObject<{
  name: z.ZodString;
  email: z.ZodString;
  message: z.ZodString;
}> => {
  const messages = {
    fr: {
      nameRequired: 'Le nom est requis',
      nameMax: 'Le nom ne peut pas dépasser 100 caractères',
      emailRequired: "L'email est requis",
      emailInvalid: "L'email est invalide",
      messageMin: 'Le message doit contenir au moins 10 caractères',
      messageMax: 'Le message ne peut pas dépasser 2000 caractères',
    },
    en: {
      nameRequired: 'Name is required',
      nameMax: 'Name cannot exceed 100 characters',
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      messageMin: 'Message must contain at least 10 characters',
      messageMax: 'Message cannot exceed 2000 characters',
    },
  };
  const m = messages[locale];
  return z.object({
    name: z.string().min(1, m.nameRequired).max(100, m.nameMax),
    email: z.string().min(1, m.emailRequired).email(m.emailInvalid),
    message: z.string().min(10, m.messageMin).max(2000, m.messageMax),
  });
};

// Keep a default schema for type inference only
const _contactFormSchema = createContactFormSchema('fr');

export type ContactFormData = z.infer<typeof _contactFormSchema>;

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
  locale?: 'fr' | 'en';
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
export function ContactForm({
  locale = 'fr',
  onSubmit,
  onSuccess,
  onError,
}: ContactFormProps): React.JSX.Element {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const schema = createContactFormSchema(locale);

  const labels = {
    fr: {
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      submit: 'Envoyer',
      sending: 'Envoi en cours...',
      retry: 'Réessayer',
      successDefault: 'Message envoyé avec succès !',
      successApi: 'Votre message a été envoyé avec succès !',
      errorDefault: 'Une erreur est survenue. Veuillez réessayer.',
      errorGeneric: 'Une erreur est survenue',
      errorSending: "Erreur lors de l'envoi du message.",
      errorRateLimit: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
      errorValidation: 'Données invalides. Veuillez vérifier le formulaire.',
      errorTurnstile: 'Vérification anti-spam échouée. Veuillez réessayer.',
    },
    en: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send',
      sending: 'Sending...',
      retry: 'Try again',
      successDefault: 'Message sent successfully!',
      successApi: 'Your message has been sent successfully!',
      errorDefault: 'An error occurred. Please try again.',
      errorGeneric: 'An error occurred',
      errorSending: 'Error sending message.',
      errorRateLimit: 'Too many requests. Please try again in a few minutes.',
      errorValidation: 'Invalid data. Please check the form.',
      errorTurnstile: 'Anti-spam verification failed. Please try again.',
    },
  };

  const t = labels[locale];

  const { register, handleSubmit, formState, reset } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
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
        setSuccessMessage(t.successDefault);
        reset(); // Clear form après succès
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : t.errorGeneric);
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
      setSuccessMessage(response.message || t.successApi);
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
          setErrorMessage(t.errorRateLimit);
        } else if (error.status === 400) {
          setErrorMessage(t.errorValidation);
        } else if (error.status === 403) {
          setErrorMessage(t.errorTurnstile);
        } else {
          setErrorMessage(error.message || t.errorSending);
        }

        if (onError) {
          onError(error);
        }
      } else {
        setErrorMessage(t.errorDefault);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Success Message */}
      {status === 'success' && (
        <div
          className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <p className="text-green-400 text-sm font-medium">✓ {successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div
          className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-red-400 text-sm font-medium">✗ {errorMessage}</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {t.name}
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border border-[var(--color-neutral-700)] bg-[var(--color-neutral-900)] text-[var(--color-neutral-100)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[var(--color-neutral-500)]"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {t.email}
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border border-[var(--color-neutral-700)] bg-[var(--color-neutral-900)] text-[var(--color-neutral-100)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[var(--color-neutral-500)]"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          {t.message}
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border border-[var(--color-neutral-700)] bg-[var(--color-neutral-900)] text-[var(--color-neutral-100)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[var(--color-neutral-500)]"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-400" role="alert">
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
        className="w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium rounded-lg hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-neutral-950)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <span>{t.sending}</span>
          </>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
}
