/**
 * Tests pour les classes d'erreur RFC 7807
 * Epic 3.2 - EF-033 à EF-040
 */

import { describe, it, expect } from 'vitest';
import {
  ApiError,
  ValidationError,
  TurnstileError,
  RateLimitError,
  EmailError,
  InternalServerError,
} from './ApiError';

describe('ApiError - RFC 7807 Error Classes', () => {
  describe('ApiError base class', () => {
    it('should create ApiError with all properties', () => {
      const error = new ApiError(
        400,
        'https://api.example.com/errors/test',
        'Test Error',
        'This is a test error',
        '/api/test',
        { extra: 'data' }
      );

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ApiError');
      expect(error.status).toBe(400);
      expect(error.type).toBe('https://api.example.com/errors/test');
      expect(error.title).toBe('Test Error');
      expect(error.detail).toBe('This is a test error');
      expect(error.instance).toBe('/api/test');
      expect(error.extensions).toEqual({ extra: 'data' });
    });

    it('should convert to RFC 7807 Problem Details format', () => {
      const error = new ApiError(
        400,
        'https://api.example.com/errors/test',
        'Test Error',
        'This is a test error',
        '/api/test',
        { fieldErrors: { name: ['Required'] } }
      );

      const problemDetails = error.toProblemDetails();

      expect(problemDetails).toEqual({
        type: 'https://api.example.com/errors/test',
        title: 'Test Error',
        status: 400,
        detail: 'This is a test error',
        instance: '/api/test',
        fieldErrors: { name: ['Required'] },
      });
    });

    it('should convert to HTTP Response', async () => {
      const error = new ApiError(
        400,
        'https://api.example.com/errors/test',
        'Test Error',
        'This is a test error'
      );

      const response = error.toResponse();

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      const body = await response.json();
      expect(body).toEqual({
        type: 'https://api.example.com/errors/test',
        title: 'Test Error',
        status: 400,
        detail: 'This is a test error',
      });
    });
  });

  describe('ValidationError (400)', () => {
    it('should create ValidationError with field errors', () => {
      const fieldErrors = {
        email: ['Invalid email format'],
        name: ['Name is required'],
      };

      const error = new ValidationError('Validation failed', fieldErrors, '/api/contact');

      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('ValidationError');
      expect(error.status).toBe(400);
      expect(error.title).toBe('Validation Failed');
      expect(error.detail).toBe('Validation failed');
      expect(error.extensions).toEqual({ fieldErrors });
    });

    it('should return 400 response with field errors', async () => {
      const fieldErrors = { email: ['Invalid email'] };
      const error = new ValidationError('Validation failed', fieldErrors);

      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.status).toBe(400);
      expect(body.fieldErrors).toEqual(fieldErrors);
    });
  });

  describe('TurnstileError (403)', () => {
    it('should create TurnstileError with default message', () => {
      const error = new TurnstileError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('TurnstileError');
      expect(error.status).toBe(403);
      expect(error.title).toBe('Turnstile Verification Failed');
      expect(error.detail).toBe('Anti-spam verification failed');
    });

    it('should create TurnstileError with custom message', () => {
      const error = new TurnstileError('Invalid token', '/api/contact');

      expect(error.detail).toBe('Invalid token');
      expect(error.instance).toBe('/api/contact');
    });

    it('should return 403 response', async () => {
      const error = new TurnstileError();
      const response = error.toResponse();

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.status).toBe(403);
      expect(body.type).toBe('https://api.example.com/errors/turnstile-error');
    });
  });

  describe('RateLimitError (429)', () => {
    it('should create RateLimitError with default values', () => {
      const error = new RateLimitError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('RateLimitError');
      expect(error.status).toBe(429);
      expect(error.title).toBe('Rate Limit Exceeded');
      expect(error.detail).toBe('Too many requests. Please try again later.');
      expect(error.retryAfter).toBe(3600);
    });

    it('should create RateLimitError with custom retry time', () => {
      const error = new RateLimitError('Rate limit exceeded', 7200, '/api/contact');

      expect(error.retryAfter).toBe(7200);
      expect(error.instance).toBe('/api/contact');
    });

    it('should return 429 response with Retry-After header', async () => {
      const error = new RateLimitError('Too many requests', 3600);
      const response = error.toResponse();

      expect(response.status).toBe(429);
      expect(response.headers.get('Retry-After')).toBe('3600');

      const body = await response.json();
      expect(body.status).toBe(429);
      expect(body.retryAfter).toBe(3600);
    });
  });

  describe('EmailError (500)', () => {
    it('should create EmailError with default message', () => {
      const error = new EmailError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('EmailError');
      expect(error.status).toBe(500);
      expect(error.title).toBe('Email Sending Failed');
      expect(error.detail).toBe('Failed to send email');
    });

    it('should create EmailError with custom message', () => {
      const error = new EmailError('SMTP connection failed', '/api/contact');

      expect(error.detail).toBe('SMTP connection failed');
      expect(error.instance).toBe('/api/contact');
    });

    it('should return 500 response', async () => {
      const error = new EmailError();
      const response = error.toResponse();

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.status).toBe(500);
      expect(body.type).toBe('https://api.example.com/errors/email-error');
    });
  });

  describe('InternalServerError (500)', () => {
    it('should create InternalServerError with default message', () => {
      const error = new InternalServerError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('InternalServerError');
      expect(error.status).toBe(500);
      expect(error.title).toBe('Internal Server Error');
      expect(error.detail).toBe('An unexpected error occurred');
    });

    it('should create InternalServerError with custom message', () => {
      const error = new InternalServerError('Database connection failed', '/api/contact');

      expect(error.detail).toBe('Database connection failed');
      expect(error.instance).toBe('/api/contact');
    });

    it('should return 500 response', async () => {
      const error = new InternalServerError();
      const response = error.toResponse();

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.status).toBe(500);
      expect(body.type).toBe('https://api.example.com/errors/internal-server-error');
    });
  });
});
