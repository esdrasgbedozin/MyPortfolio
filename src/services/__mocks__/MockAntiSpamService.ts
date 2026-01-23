/**
 * @fileoverview Mock service anti-spam pour les tests
 * @module services/__mocks__/MockAntiSpamService
 * @epic Epic 2.2 - Anti-Spam Turnstile TDD
 * @task EF-018 - Mock Turnstile pour tests (GREEN)
 */

import type { AntiSpamService } from '../AntiSpamService';
import type { TurnstileResponse } from '../TurnstileService';

/**
 * Mock service anti-spam pour les tests unitaires et d'intégration
 *
 * Permet de tester l'API Contact sans appeler l'API Cloudflare réelle.
 *
 * Comportement par défaut :
 * - Retourne success: true pour tous les tokens
 * - Peut être configuré pour simuler des échecs
 *
 * @example
 * ```typescript
 * // Dans un test
 * const mockService = new MockAntiSpamService();
 * mockService.setMockResponse({ success: false, errorCodes: ['invalid-input-response'] });
 *
 * const result = await mockService.verifyToken('test-token', '127.0.0.1');
 * expect(result.success).toBe(false);
 * ```
 */
export class MockAntiSpamService implements AntiSpamService {
  private mockResponse: TurnstileResponse = {
    success: true,
    challengeTs: new Date().toISOString(),
    hostname: 'localhost',
  };

  /**
   * Configure la réponse mock à retourner
   *
   * @param response - Réponse mock personnalisée
   */
  setMockResponse(response: TurnstileResponse): void {
    this.mockResponse = response;
  }

  /**
   * Réinitialise la réponse mock à la valeur par défaut (success: true)
   */
  reset(): void {
    this.mockResponse = {
      success: true,
      challengeTs: new Date().toISOString(),
      hostname: 'localhost',
    };
  }

  /**
   * Simule la vérification d'un token
   *
   * @param _token - Token (ignoré dans le mock)
   * @param _remoteIp - IP (ignorée dans le mock)
   * @returns Réponse mock configurée
   */
  async verifyToken(_token: string, _remoteIp: string): Promise<TurnstileResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 10));
    return this.mockResponse;
  }
}
