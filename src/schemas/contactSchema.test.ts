/**
 * @fileoverview Tests unitaires pour le schema de validation du formulaire de contact
 * @module schemas/contactSchema.test
 * @epic Epic 2.1 - ValidationService TDD
 * @task EF-010 - Test validation contact (RED)
 */

import { describe, it, expect } from 'vitest';
import { contactFormSchema } from './contactSchema';

describe('ContactForm Validation Schema', () => {
  describe('Valid Data - Cas Nominal', () => {
    it('should validate a valid contact form', () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hello, this is a test message.',
      };

      const result = contactFormSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should trim whitespace from name and message', () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        email: 'john.doe@example.com',
        message: '  Test message  ',
      };

      const result = contactFormSchema.safeParse(dataWithWhitespace);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.message).toBe('Test message');
      }
    });

    it('should lowercase and trim email', () => {
      const dataWithUppercaseEmail = {
        name: 'John Doe',
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(dataWithUppercaseEmail);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john.doe@example.com');
      }
    });
  });

  describe('Invalid Data - Edge Cases', () => {
    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'john.doe@example.com',
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject name with only whitespace', () => {
      const invalidData = {
        name: '   ',
        email: 'john.doe@example.com',
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        email: 'john.doe@example.com',
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject email without domain', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@',
        message: 'Test message',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject empty message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: '',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('should reject message with only whitespace', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: '   ',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject message longer than 2000 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'a'.repeat(2001),
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('should reject message shorter than 10 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Short',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        name: 'John Doe',
      };

      const result = contactFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Security - Injection Prevention', () => {
    it('should accept name with special characters (accents)', () => {
      const dataWithAccents = {
        name: 'François Müller',
        email: 'francois@example.com',
        message: 'Test message with special chars',
      };

      const result = contactFormSchema.safeParse(dataWithAccents);

      expect(result.success).toBe(true);
    });

    it('should accept message with newlines', () => {
      const dataWithNewlines = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Line 1\nLine 2\nLine 3',
      };

      const result = contactFormSchema.safeParse(dataWithNewlines);

      expect(result.success).toBe(true);
    });

    it('should accept message with HTML-like content (no sanitization at this level)', () => {
      const dataWithHtml = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '<script>alert("test")</script>',
      };

      const result = contactFormSchema.safeParse(dataWithHtml);

      // Note: Validation passes, sanitization happens at email sending layer
      expect(result.success).toBe(true);
    });
  });
});
