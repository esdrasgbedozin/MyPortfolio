import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactService, type ContactRequest } from './ContactService';
import {
  ValidationError,
  TurnstileError,
  RateLimitError,
  EmailError,
  InternalServerError,
} from '../errors/ApiError';

// Module-level mock fns accessible everywhere
const mockVerifyToken = vi.fn().mockResolvedValue({ success: true, score: 0.9 });
const mockIsRateLimited = vi.fn().mockResolvedValue({ limited: false });
const mockEmailSend = vi.fn().mockResolvedValue({ success: true, messageId: 'msg-123' });

vi.mock('./TurnstileService', () => ({
  TurnstileService: class {
    verifyToken = mockVerifyToken;
  },
}));

vi.mock('./RateLimitService', () => ({
  RateLimitService: class {
    isRateLimited = mockIsRateLimited;
  },
}));

vi.mock('./email/EmailServiceFactory', () => ({
  createEmailService: () => ({ send: mockEmailSend }),
}));

describe('ContactService', () => {
  let service: ContactService;
  const validRequest: ContactRequest = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message that is long enough.',
    turnstileToken: 'valid-token',
    clientIp: '192.168.1.1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyToken.mockResolvedValue({ success: true, score: 0.9 });
    mockIsRateLimited.mockResolvedValue({ limited: false });
    mockEmailSend.mockResolvedValue({ success: true, messageId: 'msg-123' });
    service = new ContactService('test-turnstile-key');
  });

  describe('processContactRequest - nominal', () => {
    it('should process a valid contact request successfully', async () => {
      await expect(service.processContactRequest(validRequest)).resolves.not.toThrow();
    });

    it('should call TurnstileService.verifyToken with correct params', async () => {
      await service.processContactRequest(validRequest);
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token', '192.168.1.1');
    });

    it('should call RateLimitService.isRateLimited with client IP', async () => {
      await service.processContactRequest(validRequest);
      expect(mockIsRateLimited).toHaveBeenCalledWith('192.168.1.1');
    });

    it('should call EmailService.send', async () => {
      await service.processContactRequest(validRequest);
      expect(mockEmailSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Contact from John Doe',
        })
      );
    });
  });

  describe('processContactRequest - validation error', () => {
    it('should throw ValidationError for invalid email', async () => {
      const invalidRequest = { ...validRequest, email: 'not-an-email' };
      await expect(service.processContactRequest(invalidRequest)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty name', async () => {
      const invalidRequest = { ...validRequest, name: '' };
      await expect(service.processContactRequest(invalidRequest)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for short message', async () => {
      const invalidRequest = { ...validRequest, message: 'Hi' };
      await expect(service.processContactRequest(invalidRequest)).rejects.toThrow(ValidationError);
    });
  });

  describe('processContactRequest - turnstile error', () => {
    it('should throw TurnstileError when verification fails', async () => {
      mockVerifyToken.mockResolvedValueOnce({ success: false });
      await expect(service.processContactRequest(validRequest)).rejects.toThrow(TurnstileError);
    });
  });

  describe('processContactRequest - rate limit error', () => {
    it('should throw RateLimitError when rate limited', async () => {
      mockIsRateLimited.mockResolvedValueOnce({ limited: true, retryAfter: 3600 });
      await expect(service.processContactRequest(validRequest)).rejects.toThrow(RateLimitError);
    });

    it('should throw RateLimitError with default retryAfter when not provided', async () => {
      mockIsRateLimited.mockResolvedValueOnce({ limited: true, retryAfter: undefined });
      await expect(service.processContactRequest(validRequest)).rejects.toThrow(RateLimitError);
    });
  });

  describe('processContactRequest - email error', () => {
    it('should throw EmailError when email sending fails', async () => {
      mockEmailSend.mockRejectedValueOnce(new Error('SMTP failure'));
      await expect(service.processContactRequest(validRequest)).rejects.toThrow(EmailError);
    });
  });

  describe('processContactRequest - unexpected error', () => {
    it('should throw InternalServerError for unknown errors', async () => {
      mockVerifyToken.mockRejectedValueOnce('non-error-value');
      await expect(service.processContactRequest(validRequest)).rejects.toThrow(
        InternalServerError
      );
    });
  });

  describe('constructor', () => {
    it('should create service with default rate limit params', () => {
      const svc = new ContactService('key');
      expect(svc).toBeInstanceOf(ContactService);
    });

    it('should create service with custom rate limit params', () => {
      const svc = new ContactService('key', 10, 7200000);
      expect(svc).toBeInstanceOf(ContactService);
    });
  });
});
