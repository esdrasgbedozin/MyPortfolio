/**
 * @fileoverview Service anti-spam Cloudflare Turnstile
 * @module services/TurnstileService
 * @epic Epic 2.2 - Anti-Spam Turnstile TDD
 * @task EF-016 - Implémenter service Turnstile (GREEN)
 * @task EF-017 - Extraire interface service (REFACTOR)
 */

import type { AntiSpamService } from './AntiSpamService';

/**
 * Interface pour la réponse de l'API Cloudflare Turnstile
 *
 * @see {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | Turnstile API Documentation}
 */
export interface TurnstileResponse {
  /** Indique si la vérification a réussi */
  success: boolean;
  /** Timestamp ISO 8601 du challenge */
  challengeTs?: string;
  /** Hostname du site qui a émis le challenge */
  hostname?: string;
  /** Codes d'erreur si la vérification échoue */
  errorCodes?: string[];
  /** Action name (optional, only if configured) */
  action?: string;
  /** cData (optional, only if configured) */
  cdata?: string;
}

/**
 * Service de vérification des tokens Cloudflare Turnstile (anti-spam)
 *
 * Implémente l'interface AntiSpamService pour respecter le Dependency Inversion Principle.
 *
 * Responsabilités (Single Responsibility Principle) :
 * - Vérifier les tokens Turnstile côté serveur
 * - Gérer les appels à l'API Cloudflare
 * - Transformer les réponses API en format interne
 *
 * @example
 * ```typescript
 * const service: AntiSpamService = new TurnstileService(process.env.TURNSTILE_SECRET_KEY);
 * const result = await service.verifyToken('user-token', '192.168.1.1');
 * if (result.success) {
 *   // Token valide, autoriser la requête
 * } else {
 *   // Token invalide, rejeter la requête
 * }
 * ```
 */
export class TurnstileService implements AntiSpamService {
  private readonly TURNSTILE_VERIFY_URL =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  private readonly secretKey: string;

  /**
   * Crée une instance du service Turnstile
   *
   * @param secretKey - Clé secrète Cloudflare Turnstile (serveur)
   * @throws {Error} Si la clé secrète est manquante ou vide
   */
  constructor(secretKey: string) {
    if (!secretKey || secretKey.trim() === '') {
      throw new Error('Turnstile secret key is required');
    }
    this.secretKey = secretKey;
  }

  /**
   * Vérifie un token Turnstile auprès de l'API Cloudflare
   *
   * @param token - Token Turnstile reçu du client (cf-turnstile-response)
   * @param remoteIp - Adresse IP du client (optionnelle mais recommandée)
   * @returns Résultat de la vérification avec success, challengeTs, hostname, errorCodes
   * @throws {Error} Si l'appel API échoue (réseau, timeout, 5xx)
   *
   * @see {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | API Reference}
   */
  async verifyToken(token: string, remoteIp: string): Promise<TurnstileResponse> {
    try {
      const response = await fetch(this.TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: this.secretKey,
          response: token,
          remoteip: remoteIp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Turnstile API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: data.success,
        challengeTs: data.challenge_ts,
        hostname: data.hostname,
        errorCodes: data['error-codes'],
        action: data.action,
        cdata: data.cdata,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Turnstile verification failed: ${error.message}`);
      }
      throw new Error('Turnstile verification failed: Unknown error');
    }
  }
}
