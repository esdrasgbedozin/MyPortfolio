import type { APIRoute } from 'astro';

/**
 * EF-047: Create handler /api/health.ts
 * EF-049: Implement checks
 *
 * Critère de Fin: Handler ping services, retourne détails (GREEN)
 *
 * Epic 4.1: Endpoint Health
 * Phase: TDD GREEN
 */

interface ServiceStatus {
  resend: 'up' | 'down';
  turnstile: 'up' | 'down';
}

interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  services: ServiceStatus;
}

/**
 * Check if Resend API is available
 * In production, this would verify API key is set and valid
 */
async function checkResend(): Promise<'up' | 'down'> {
  try {
    const apiKey = import.meta.env.RESEND_API_KEY;
    // Basic check: API key is configured
    return apiKey && apiKey.length > 0 ? 'up' : 'down';
  } catch {
    return 'down';
  }
}

/**
 * Check if Cloudflare Turnstile is configured
 */
async function checkTurnstile(): Promise<'up' | 'down'> {
  try {
    const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
    // Basic check: Secret key is configured
    return secretKey && secretKey.length > 0 ? 'up' : 'down';
  } catch {
    return 'down';
  }
}

export const GET: APIRoute = async () => {
  // Check all services in parallel
  const [resendStatus, turnstileStatus] = await Promise.all([checkResend(), checkTurnstile()]);

  const services: ServiceStatus = {
    resend: resendStatus,
    turnstile: turnstileStatus,
  };

  // Overall status is degraded if ANY service is down
  const hasDownService = Object.values(services).includes('down');
  const overallStatus: 'healthy' | 'degraded' = hasDownService ? 'degraded' : 'healthy';

  const healthData: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services,
  };

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
