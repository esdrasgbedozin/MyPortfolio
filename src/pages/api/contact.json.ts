/**
 * API Endpoint : POST /api/contact.json
 * Epic 3.1 - EF-031 & EF-032
 * Epic 3.2 - EF-034, EF-036, EF-038, EF-040 (Error Handling)
 * Epic 3.3 - EF-043, EF-044, EF-045 (Logging & RequestId)
 *
 * Handler léger qui délègue la logique métier au ContactService.
 * Gère les exceptions RFC 7807 pour retourner des réponses structurées.
 * Logs structurés avec requestId pour traçabilité.
 */

import type { APIContext } from 'astro';
import { ContactService } from '../../services/ContactService';
import { ApiError, InternalServerError } from '../../errors/ApiError';
import { logger } from '../../utils/logger';

/**
 * POST /api/contact.json
 * Traite une demande de contact
 */
export async function POST(context: APIContext): Promise<Response> {
  // Generate unique requestId for tracing (EF-045)
  const requestId = crypto.randomUUID();

  try {
    // Parse request body
    const body = await context.request.json();
    const { name, email, message, turnstileToken } = body;
    const clientIp = context.clientAddress || '0.0.0.0';

    // Log incoming request (EF-043)
    logger.info('Contact form submission received', {
      context: 'api/contact',
      requestId,
      clientIp,
      hasName: !!name,
      hasEmail: !!email,
    });

    // Delegate to service (throws ApiError on failure)
    const contactService = new ContactService(import.meta.env.TURNSTILE_SECRET_KEY || '');

    await contactService.processContactRequest({
      name,
      email,
      message,
      turnstileToken,
      clientIp,
    });

    // Log success (EF-043)
    logger.info('Contact form processed successfully', {
      context: 'api/contact',
      requestId,
      email,
    });

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message envoyé avec succès',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Handle ApiError (RFC 7807) exceptions
    if (error instanceof ApiError) {
      // Log specific error type (EF-043)
      logger.warn('API error occurred', {
        context: 'api/contact',
        requestId,
        errorType: error.constructor.name,
        status: error.status,
      });

      return error.toResponse();
    }

    // Handle unexpected errors
    logger.error('Unexpected error in POST /api/contact', error as Error, {
      context: 'api/contact',
      requestId,
    });

    const internalError = new InternalServerError('An unexpected error occurred', '/api/contact');
    return internalError.toResponse();
  }
}
