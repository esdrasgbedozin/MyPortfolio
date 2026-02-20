/**
 * @fileoverview Implémentation EmailService avec SendGrid (fallback)
 * @module services/email/SendGridEmailService
 * @epic Epic 2.3 - EmailService Factory + Retry Policy
 * @task EF-022-023 - Implémenter SendGridEmailService
 */

import sgMail from '@sendgrid/mail';
import type { EmailService, EmailPayload, EmailSendResult } from './EmailService';

/**
 * Implémentation du service d'envoi d'emails avec SendGrid (fallback)
 *
 * SendGrid est utilisé comme provider de secours si Resend échoue.
 */
export class SendGridEmailService implements EmailService {
  private readonly defaultFrom: string;

  constructor(apiKey: string, defaultFrom: string = 'onboarding@resend.dev') {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('SendGrid API key is required');
    }

    sgMail.setApiKey(apiKey);
    this.defaultFrom = defaultFrom;
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const [response] = await sgMail.send({
        to: payload.to,
        from: payload.from || this.defaultFrom,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
      });

      return {
        success: true,
        messageId: response.headers['x-message-id'],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
