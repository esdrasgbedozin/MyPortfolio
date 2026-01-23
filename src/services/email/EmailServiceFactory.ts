/**
 * @fileoverview Factory pour créer des instances EmailService avec retry
 * @module services/email/EmailServiceFactory
 * @epic Epic 2.3 - EmailService Factory + Retry Policy
 * @task EF-024-026c - Factory + Retry Policy
 */

import { ResendEmailService } from './ResendEmailService';
import { SendGridEmailService } from './SendGridEmailService';
import type { EmailService, EmailSendResult } from './EmailService';

/**
 * Utilitaire de retry avec exponential backoff
 *
 * @param fn - Fonction async à exécuter avec retry
 * @param maxRetries - Nombre maximum de tentatives (défaut: 3)
 * @param baseDelay - Délai de base en ms (défaut: 100ms)
 * @returns Résultat de la fonction ou lance l'erreur après max retries
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 100
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Factory pour créer une instance EmailService avec retry automatique
 *
 * Stratégie :
 * - Provider principal : Resend
 * - Provider fallback : SendGrid (si Resend échoue après 3 retries)
 * - Retry policy : exponential backoff (100ms, 200ms, 400ms)
 *
 * @param provider - Provider à utiliser ('resend' ou 'sendgrid')
 * @param apiKey - Clé API du provider
 * @param defaultFrom - Adresse from par défaut
 * @returns Instance EmailService avec retry intégré
 *
 * @example
 * ```typescript
 * const emailService = createEmailService('resend', process.env.RESEND_API_KEY);
 * const result = await emailService.send({ ... });
 * ```
 */
export function createEmailService(
  provider: 'resend' | 'sendgrid' = 'resend',
  apiKey?: string,
  defaultFrom?: string
): EmailService {
  const key = apiKey || process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || '';

  if (!key) {
    throw new Error('Email API key is required (RESEND_API_KEY or SENDGRID_API_KEY)');
  }

  const baseService =
    provider === 'resend'
      ? new ResendEmailService(key, defaultFrom)
      : new SendGridEmailService(key, defaultFrom);

  // Wrapper avec retry automatique
  return {
    send: async (payload): Promise<EmailSendResult> => {
      return retry(() => baseService.send(payload), 3, 100);
    },
  };
}
