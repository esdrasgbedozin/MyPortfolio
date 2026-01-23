/**
 * @fileoverview Interface pour les services d'envoi d'emails
 * @module services/email/EmailService
 * @epic Epic 2.3 - EmailService Factory + Retry Policy
 * @task EF-019 - Définir interface EmailService (TEST)
 */

/**
 * Payload d'un email à envoyer
 */
export interface EmailPayload {
  /** Adresse email du destinataire */
  to: string;
  /** Adresse email de l'expéditeur (optionnelle, utilise le from par défaut si absente) */
  from?: string;
  /** Sujet de l'email */
  subject: string;
  /** Corps HTML de l'email */
  html: string;
  /** Corps texte brut de l'email (fallback si HTML non supporté) */
  text: string;
  /** Adresse email de réponse (optionnelle) */
  replyTo?: string;
}

/**
 * Résultat de l'envoi d'un email
 */
export interface EmailSendResult {
  /** Indique si l'envoi a réussi */
  success: boolean;
  /** ID du message généré par le provider (si succès) */
  messageId?: string;
  /** Message d'erreur (si échec) */
  error?: string;
}

/**
 * Interface générique pour les services d'envoi d'emails
 *
 * Permet de respecter le Dependency Inversion Principle :
 * - Les modules de haut niveau (API handlers) dépendent de cette abstraction
 * - Les implémentations concrètes (ResendEmailService, SendGridEmailService) implémentent cette interface
 *
 * Avantages :
 * - Facilite le testing (mock facile)
 * - Permet de changer de provider email sans toucher au code métier
 * - Open/Closed Principle : extensible sans modification
 * - Liskov Substitution Principle : toutes les implémentations sont interchangeables
 *
 * @example
 * ```typescript
 * // Dans un test
 * class MockEmailService implements EmailService {
 *   async send(payload: EmailPayload): Promise<EmailSendResult> {
 *     return { success: true, messageId: 'mock-id' };
 *   }
 * }
 *
 * // Dans le handler API
 * const emailService: EmailService = createEmailService();
 * const result = await emailService.send({
 *   to: 'user@example.com',
 *   subject: 'Test',
 *   html: '<p>Hello</p>',
 *   text: 'Hello'
 * });
 * ```
 */
export interface EmailService {
  /**
   * Envoie un email
   *
   * @param payload - Données de l'email à envoyer
   * @returns Résultat de l'envoi (success, messageId, error)
   * @throws {Error} En cas d'erreur réseau ou de configuration invalide
   */
  send(payload: EmailPayload): Promise<EmailSendResult>;
}
