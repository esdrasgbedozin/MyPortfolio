/**
 * Contact Service : Logique métier pour gérer les demandes de contact
 * Epic 3.1 - EF-032 (REFACTOR)
 * Epic 3.2 - EF-034, EF-036, EF-038, EF-040 (Error Handling)
 *
 * Responsabilités :
 * - Valider le payload
 * - Vérifier l'anti-spam (Turnstile)
 * - Appliquer le rate limiting
 * - Envoyer l'email
 * - Lever des exceptions typées RFC 7807
 *
 * Séparation handler/service pour meilleure testabilité.
 */

import { validateContactForm } from './contactValidation';
import { TurnstileService } from './TurnstileService';
import { RateLimitService } from './RateLimitService';
import { createEmailService } from './email/EmailServiceFactory';
import {
  ValidationError,
  TurnstileError,
  RateLimitError,
  EmailError,
  InternalServerError,
} from '../errors/ApiError';
import { logger } from '../utils/logger';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  clientIp: string;
}

/**
 * Service Contact : Gère la logique complète d'une demande de contact
 * Lance des exceptions typées en cas d'erreur (RFC 7807)
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
   * @throws {ValidationError} Si la validation échoue
   * @throws {TurnstileError} Si la vérification Turnstile échoue
   * @throws {RateLimitError} Si le rate limit est dépassé
   * @throws {EmailError} Si l'envoi d'email échoue
   * @throws {InternalServerError} Si une erreur inattendue se produit
   */
  async processContactRequest(request: ContactRequest): Promise<void> {
    try {
      this.validateRequest(request);
      await this.verifyAntiSpam(request);
      await this.checkRateLimit(request.clientIp);
      await this.sendEmail(request);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Valide les données du formulaire
   * @throws {ValidationError} Si la validation échoue
   */
  private validateRequest(request: ContactRequest): void {
    const validationResult = validateContactForm({
      name: request.name,
      email: request.email,
      message: request.message,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      throw new ValidationError(
        'Validation failed for one or more fields',
        fieldErrors,
        '/api/contact'
      );
    }
  }

  /**
   * Vérifie le token Turnstile anti-spam
   * @throws {TurnstileError} Si la vérification échoue
   */
  private async verifyAntiSpam(request: ContactRequest): Promise<void> {
    const turnstileResult = await this.turnstileService.verifyToken(
      request.turnstileToken,
      request.clientIp
    );

    if (!turnstileResult.success) {
      throw new TurnstileError('Anti-spam verification failed. Please try again.', '/api/contact');
    }
  }

  /**
   * Vérifie le rate limit pour l'IP
   * @throws {RateLimitError} Si le rate limit est dépassé
   */
  private async checkRateLimit(clientIp: string): Promise<void> {
    const rateLimitResult = await this.rateLimitService.isRateLimited(clientIp);

    if (rateLimitResult.limited) {
      throw new RateLimitError(
        'Too many requests from this IP. Please try again later.',
        rateLimitResult.retryAfter || 3600,
        '/api/contact'
      );
    }
  }

  /**
   * Envoie l'email de contact
   * @throws {EmailError} Si l'envoi échoue
   */
  private async sendEmail(request: ContactRequest): Promise<void> {
    try {
      const emailService = createEmailService();
      await emailService.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.CONTACT_RECIPIENT_EMAIL || 'ogbedozin@gmail.com',
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
    } catch (error) {
      logger.error('Email sending failed', error instanceof Error ? error : undefined, {
        context: 'ContactService',
      });
      throw new EmailError('Failed to send email. Please try again later.', '/api/contact');
    }
  }

  /**
   * Gère les erreurs en les re-throwant ou en les wrappant
   * @throws {ApiError} Lance l'erreur appropriée
   */
  private handleError(error: unknown): never {
    // Re-throw known errors
    if (
      error instanceof ValidationError ||
      error instanceof TurnstileError ||
      error instanceof RateLimitError ||
      error instanceof EmailError
    ) {
      throw error;
    }

    // Wrap unknown errors
    logger.error('Unexpected error in ContactService', error instanceof Error ? error : undefined, {
      context: 'ContactService',
    });
    throw new InternalServerError(
      'An unexpected error occurred while processing your request',
      '/api/contact'
    );
  }
}
