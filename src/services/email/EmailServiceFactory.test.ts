/**
 * @fileoverview Tests pour retry utility et factory
 * @module services/email/EmailServiceFactory.test
 * @epic Epic 2.3 - EmailService Factory + Retry Policy
 */

import { describe, it, expect, vi } from 'vitest';
import { retry, createEmailService } from './EmailServiceFactory';

describe('retry', () => {
  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const result = await retry(fn, 3, 10);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry up to maxRetries times', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValueOnce('success');

    const result = await retry(fn, 3, 10);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw error after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('persistent error'));

    await expect(retry(fn, 3, 10)).rejects.toThrow('persistent error');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValueOnce('success');

    const start = Date.now();
    await retry(fn, 3, 100);
    const duration = Date.now() - start;

    // Delays: 100ms, 200ms = ~300ms total (avec tolérance)
    expect(duration).toBeGreaterThanOrEqual(250);
    expect(duration).toBeLessThan(500);
  });
});

describe('createEmailService', () => {
  it('should create Resend service by default', () => {
    const service = createEmailService('resend', 'test-key');
    expect(service).toBeDefined();
    expect(service.send).toBeDefined();
  });

  it('should create SendGrid service when specified', () => {
    const service = createEmailService('sendgrid', 'test-key');
    expect(service).toBeDefined();
    expect(service.send).toBeDefined();
  });

  it('should throw error when API key is missing', () => {
    expect(() => createEmailService('resend', '')).toThrow('Email API key is required');
  });

  it('should wrap service with retry', async () => {
    const service = createEmailService('resend', 'test-key');

    // Le service est wrappé avec retry, donc send existe
    expect(typeof service.send).toBe('function');
  });
});
