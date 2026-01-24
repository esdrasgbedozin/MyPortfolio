/**
 * API Endpoint : POST /api/contact.json
 * Epic 3.1 - EF-031 & EF-032
 *
 * Handler léger qui délègue la logique métier au ContactService.
 *
 * Responsabilités du handler :
 * - Parser la requête
 * - Extraire l'IP client
 * - Déléguer au service
 * - Formater la réponse HTTP
 */

import type { APIContext } from 'astro';
import { ContactService } from '../../services/ContactService';

/**
 * POST /api/contact.json
 * Traite une demande de contact
 */
export async function POST(context: APIContext): Promise<Response> {
  try {
    // Parse request body
    const body = await context.request.json();
    const { name, email, message, turnstileToken } = body;
    const clientIp = context.clientAddress || '0.0.0.0';

    // Delegate to service
    const contactService = new ContactService(import.meta.env.TURNSTILE_SECRET_KEY || '');

    const result = await contactService.processContactRequest({
      name,
      email,
      message,
      turnstileToken,
      clientIp,
    });

    // Format response based on result
    if (!result.success && result.error) {
      const statusCodes = {
        validation: 400,
        turnstile: 403,
        rateLimit: 429,
        email: 500,
        internal: 500,
      };

      const status = statusCodes[result.error.type];
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      // Add Retry-After header for rate limit
      if (result.error.type === 'rateLimit') {
        headers['Retry-After'] = '3600'; // 1 hour
      }

      return new Response(
        JSON.stringify({
          error: result.error.message,
          details: result.error.details,
        }),
        { status, headers }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message envoyé avec succès',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Generic error handling (improved in Epic 3.2)
    console.error('Error in POST /api/contact:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
