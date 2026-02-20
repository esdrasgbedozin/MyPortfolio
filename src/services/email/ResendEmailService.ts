/**
 * @fileoverview Implémentation EmailService avec Resend
 * @module services/email/ResendEmailService
 * @epic Epic 2.3 - EmailService Factory + Retry Policy
 * @task EF-021 - Implémenter ResendEmailService (GREEN)
 */

import { Resend } from 'resend';
import type { EmailService, EmailPayload, EmailSendResult } from './EmailService';

/**
 * Implémentation du service d'envoi d'emails avec Resend
 *
 * Resend est le provider principal pour l'envoi d'emails.
 * Caractéristiques :
 * - API simple et moderne
 * - Bonne délivrabilité
 * - Pricing attractif (premier tier gratuit)
 *
 * @see {@link https://resend.com/docs/api-reference/emails/send-email | Resend API Docs}
 *
 * @example
 * ```typescript
 * const service = new ResendEmailService(process.env.RESEND_API_KEY);
 * const result = await service.send({
 *   to: 'user@example.com',
 *   subject: 'Test',
 *   html: '<p>Hello</p>',
 *   text: 'Hello'
 * });
 * ```
 */
export class ResendEmailService implements EmailService {
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  /**
   * Crée une instance du service Resend
   *
   * @param apiKey - Clé API Resend
   * @param defaultFrom - Adresse email par défaut de l'expéditeur
   * @throws {Error} Si la clé API est manquante
   */
  constructor(apiKey: string, defaultFrom: string = 'onboarding@resend.dev') {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Resend API key is required');
    }

    this.resend = new Resend(apiKey);
    this.defaultFrom = defaultFrom;
  }

  /**
   * Envoie un email via l'API Resend
   *
   * @param payload - Données de l'email
   * @returns Résultat de l'envoi (success, messageId, error)
   */
  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        to: payload.to,
        from: payload.from || this.defaultFrom,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
      });

      if (error) {
        return {
          success: false,
          error: `Resend API error: ${error.message}`,
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
