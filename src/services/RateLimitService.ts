/**
 * @fileoverview Service de rate limiting par IP
 * @module services/RateLimitService
 * @epic Epic 2.4 - RateLimitService TDD
 * @task EF-028 - Implémenter rate limiter (GREEN)
 */

/**
 * Résultat de la vérification rate limit
 */
export interface RateLimitResult {
  /** Indique si la requête est limitée (bloquée) */
  limited: boolean;
  /** Nombre de requêtes restantes dans la fenêtre */
  remainingRequests: number;
  /** Timestamp de réinitialisation du compteur (ISO 8601) */
  resetAt?: string;
  /** Nombre de secondes à attendre avant retry (si limitée) */
  retryAfter?: number;
}

/**
 * Entrée de rate limit pour une IP
 */
interface RateLimitEntry {
  count: number;
  resetAt: number; // Timestamp
}

/**
 * Service de rate limiting basé sur l'IP
 *
 * Implémentation en mémoire (simple Map).
 * Pour une production avec multiple instances, utiliser Vercel Edge Config ou Redis.
 *
 * Responsabilités :
 * - Tracker le nombre de requêtes par IP
 * - Bloquer les IPs dépassant le seuil
 * - Nettoyer les entrées expirées automatiquement
 *
 * @example
 * ```typescript
 * const rateLimiter = new RateLimitService(5, 3600000); // 5 req/heure
 * const result = await rateLimiter.isRateLimited('192.168.1.1');
 * if (result.limited) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 * ```
 */
export class RateLimitService {
  private readonly store: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private cleanupTimer?: NodeJS.Timeout;

  /**
   * Crée une instance du service de rate limiting
   *
   * @param maxRequests - Nombre maximum de requêtes autorisées par fenêtre
   * @param windowMs - Durée de la fenêtre en millisecondes
   */
  constructor(maxRequests: number = 5, windowMs: number = 3600000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Auto-cleanup toutes les 5 minutes
    this.cleanupTimer = setInterval(() => {
      void this.cleanup();
    }, 300000);
  }

  /**
   * Vérifie si une IP est rate limitée
   *
   * @param ip - Adresse IP du client
   * @returns Résultat avec limited, remainingRequests, resetAt, retryAfter
   */
  async isRateLimited(ip: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(ip);

    // Nouvelle IP ou fenêtre expirée
    if (!entry || now >= entry.resetAt) {
      this.store.set(ip, {
        count: 1,
        resetAt: now + this.windowMs,
      });

      return {
        limited: false,
        remainingRequests: this.maxRequests - 1,
        resetAt: new Date(now + this.windowMs).toISOString(),
      };
    }

    // IP existante, incrémenter compteur
    entry.count++;

    // Vérifier si limite dépassée
    if (entry.count > this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

      return {
        limited: true,
        remainingRequests: 0,
        resetAt: new Date(entry.resetAt).toISOString(),
        retryAfter,
      };
    }

    return {
      limited: false,
      remainingRequests: this.maxRequests - entry.count,
      resetAt: new Date(entry.resetAt).toISOString(),
    };
  }

  /**
   * Nettoie les entrées expirées du store
   *
   * Appelé automatiquement toutes les 5 minutes.
   * Peut aussi être appelé manuellement pour tests.
   */
  async cleanup(): Promise<void> {
    const now = Date.now();

    for (const [ip, entry] of this.store.entries()) {
      if (now >= entry.resetAt) {
        this.store.delete(ip);
      }
    }
  }

  /**
   * Arrête le timer de cleanup (utile pour les tests)
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}
