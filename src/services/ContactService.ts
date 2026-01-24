/**
 * Contact Service : Logique métier pour gérer les demandes de contact
 * Epic 3.1 - EF-032 (REFACTOR)
 *
 * Responsabilités :
 * - Valider le payload
 * - Vérifier l'anti-spam (Turnstile)
 * - Appliquer le rate limiting
 * - Envoyer l'email
 *
 * Séparation handler/service pour meilleure testabilité.
 */

import { validateContactForm } from './contactValidation';
import { TurnstileService } from './TurnstileService';
import { RateLimitService } from './RateLimitService';
import { createEmailService } from './email/EmailServiceFactory';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  clientIp: string;
}

export interface ContactResult {
  success: boolean;
  error?: {
    type: 'validation' | 'turnstile' | 'rateLimit' | 'email' | 'internal';
    message: string;
    details?: unknown;
  };
}

/**
 * Service Contact : Gère la logique complète d'une demande de contact
 */
export class ContactService {
  private turnstileService: TurnstileService;
  private rateLimitService: RateLimitService;

  constructor(
    turnstileSecretKey: string,
    rateLimitMax: number = 5,
    rateLimitWindow: number = 3600000 // 1 hour
  ) {
    this.turnstileService = new TurnstileService(turnstileSecretKey);
    this.rateLimitService = new RateLimitService(rateLimitMax, rateLimitWindow);
  }

  /**
   * Traite une demande de contact complète
   */
  async processContactRequest(request: ContactRequest): Promise<ContactResult> {
    // 1. Validate payload
    const validationResult = validateContactForm({
      name: request.name,
      email: request.email,
      message: request.message,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
      };
    }

    // 2. Verify Turnstile token
    const turnstileResult = await this.turnstileService.verifyToken(
      request.turnstileToken,
      request.clientIp
    );

    if (!turnstileResult.success) {
      return {
        success: false,
        error: {
          type: 'turnstile',
          message: 'Anti-spam verification failed',
        },
      };
    }

    // 3. Check rate limit
    const isRateLimited = await this.rateLimitService.isRateLimited(request.clientIp);

    if (isRateLimited) {
      return {
        success: false,
        error: {
          type: 'rateLimit',
          message: 'Too many requests. Please try again later.',
        },
      };
    }

    // 4. Send email
    try {
      const emailService = createEmailService();
      await emailService.send({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: process.env.EMAIL_TO || 'contact@example.com',
        subject: `Contact from ${request.name}`,
        text: `Nouveau message de contact\n\nNom: ${request.name}\nEmail: ${request.email}\nMessage: ${request.message}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${request.name}</p>
          <p><strong>Email :</strong> ${request.email}</p>
          <p><strong>Message :</strong></p>
          <p>${request.message}</p>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: {
          type: 'email',
          message: 'Failed to send email',
        },
      };
    }
  }
}
