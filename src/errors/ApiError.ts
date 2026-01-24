/**
 * RFC 7807 Problem Details for HTTP APIs
 * Epic 3.2 - EF-033 à EF-040
 *
 * Standard RFC 7807 pour représenter les erreurs HTTP de manière structurée.
 *
 * Format :
 * - type: URI identifiant le type de problème
 * - title: Court résumé lisible du problème
 * - status: Code HTTP
 * - detail: Explication détaillée
 * - instance: URI de l'instance spécifique de l'erreur
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7807
 */

/**
 * Interface RFC 7807 Problem Details
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  [key: string]: unknown;
}

/**
 * Base class pour toutes les erreurs API
 * Implémente RFC 7807 Problem Details
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly type: string;
  public readonly title: string;
  public readonly detail: string;
  public readonly instance?: string;
  public readonly extensions?: Record<string, unknown>;

  constructor(
    status: number,
    type: string,
    title: string,
    detail: string,
    instance?: string,
    extensions?: Record<string, unknown>
  ) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.title = title;
    this.detail = detail;
    this.instance = instance;
    this.extensions = extensions;

    // Maintain proper stack trace (only for V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Convert to RFC 7807 JSON format
   */
  toProblemDetails(): ProblemDetails {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      ...(this.instance && { instance: this.instance }),
      ...(this.extensions && this.extensions),
    };
  }

  /**
   * Convert to HTTP Response
   */
  toResponse(): Response {
    return new Response(JSON.stringify(this.toProblemDetails()), {
      status: this.status,
      headers: {
        'Content-Type': 'application/problem+json',
      },
    });
  }
}

/**
 * 400 Bad Request - Validation error
 */
export class ValidationError extends ApiError {
  constructor(detail: string, fieldErrors?: Record<string, string[]>, instance?: string) {
    super(
      400,
      'https://api.example.com/errors/validation-error',
      'Validation Failed',
      detail,
      instance,
      fieldErrors ? { fieldErrors } : undefined
    );
    this.name = 'ValidationError';
  }
}

/**
 * 403 Forbidden - Turnstile verification failed
 */
export class TurnstileError extends ApiError {
  constructor(detail: string = 'Anti-spam verification failed', instance?: string) {
    super(
      403,
      'https://api.example.com/errors/turnstile-error',
      'Turnstile Verification Failed',
      detail,
      instance
    );
    this.name = 'TurnstileError';
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter: number;

  constructor(
    detail: string = 'Too many requests. Please try again later.',
    retryAfter: number = 3600,
    instance?: string
  ) {
    super(
      429,
      'https://api.example.com/errors/rate-limit-error',
      'Rate Limit Exceeded',
      detail,
      instance,
      { retryAfter }
    );
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }

  /**
   * Override toResponse to add Retry-After header
   */
  toResponse(): Response {
    return new Response(JSON.stringify(this.toProblemDetails()), {
      status: this.status,
      headers: {
        'Content-Type': 'application/problem+json',
        'Retry-After': this.retryAfter.toString(),
      },
    });
  }
}

/**
 * 500 Internal Server Error - Email sending failed
 */
export class EmailError extends ApiError {
  constructor(detail: string = 'Failed to send email', instance?: string) {
    super(
      500,
      'https://api.example.com/errors/email-error',
      'Email Sending Failed',
      detail,
      instance
    );
    this.name = 'EmailError';
  }
}

/**
 * 500 Internal Server Error - Generic internal error
 */
export class InternalServerError extends ApiError {
  constructor(detail: string = 'An unexpected error occurred', instance?: string) {
    super(
      500,
      'https://api.example.com/errors/internal-server-error',
      'Internal Server Error',
      detail,
      instance
    );
    this.name = 'InternalServerError';
  }
}
