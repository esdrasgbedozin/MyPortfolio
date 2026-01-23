/**
 * @fileoverview Interface pour les services anti-spam
 * @module services/AntiSpamService
 * @epic Epic 2.2 - Anti-Spam Turnstile TDD
 * @task EF-017 - Extraire interface service (REFACTOR)
 */

import type { TurnstileResponse } from './TurnstileService';

/**
 * Interface générique pour les services anti-spam
 *
 * Permet de respecter le Dependency Inversion Principle :
 * - Les modules de haut niveau (API handlers) dépendent de cette abstraction
 * - Les implémentations concrètes (TurnstileService) implémentent cette interface
 *
 * Avantages :
 * - Facilite le testing (mock facile)
 * - Permet de changer de provider anti-spam sans toucher au code métier
 * - Open/Closed Principle : extensible sans modification
 *
 * @example
 * ```typescript
 * // Dans un test
 * class MockAntiSpamService implements AntiSpamService {
 *   async verifyToken(token: string, remoteIp: string): Promise<TurnstileResponse> {
 *     return { success: true };
 *   }
 * }
 *
 * // Dans le handler API
 * const antiSpamService: AntiSpamService = new TurnstileService(secretKey);
 * const result = await antiSpamService.verifyToken(token, ip);
 * ```
 */
export interface AntiSpamService {
  /**
   * Vérifie un token anti-spam
   *
   * @param token - Token à vérifier
   * @param remoteIp - Adresse IP du client
   * @returns Résultat de la vérification
   * @throws {Error} Si la vérification échoue (erreur réseau, timeout, etc.)
   */
  verifyToken(token: string, remoteIp: string): Promise<TurnstileResponse>;
}
