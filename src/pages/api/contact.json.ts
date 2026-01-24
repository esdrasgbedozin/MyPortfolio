/**
 * API Endpoint : POST /api/contact.json
 * Epic 3.1 - EF-031 & EF-032
 * Epic 3.2 - EF-034, EF-036, EF-038, EF-040 (Error Handling)
 *
 * Handler léger qui délègue la logique métier au ContactService.
 * Gère les exceptions RFC 7807 pour retourner des réponses structurées.
 */

import type { APIContext } from 'astro';
import { ContactService } from '../../services/ContactService';
import { ApiError, InternalServerError } from '../../errors/ApiError';

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

    // Delegate to service (throws ApiError on failure)
    const contactService = new ContactService(import.meta.env.TURNSTILE_SECRET_KEY || '');

    await contactService.processContactRequest({
      name,
      email,
      message,
      turnstileToken,
      clientIp,
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
      return error.toResponse();
    }

    // Handle unexpected errors
    console.error('Unexpected error in POST /api/contact:', error);
    const internalError = new InternalServerError('An unexpected error occurred', '/api/contact');
    return internalError.toResponse();
  }
}
