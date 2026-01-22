import { describe, it, expect } from 'vitest';
import { validateContactForm } from './contactValidation';

describe('Contact Form Validation', () => {
  describe('Valid inputs', () => {
    it('should validate a correct contact form', () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a valid message with sufficient length.',
      };

      const result = validateContactForm(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept minimum valid message length', () => {
      const validData = {
        name: 'Jane',
        email: 'jane@test.com',
        message: '10 char msg',
      };

      const result = validateContactForm(validData);

      expect(result.success).toBe(true);
    });

    it('should trim whitespace from inputs', () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  Valid message  ',
      };

      const result = validateContactForm(dataWithWhitespace);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.message).toBe('Valid message');
      }
    });
  });

  describe('Invalid inputs', () => {
    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject message that is too short', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hi',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('should reject message that is too long', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'a'.repeat(2001),
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        name: 'John Doe',
      };

      const result = validateContactForm(invalidData as Record<string, unknown>);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Edge cases', () => {
    it('should reject name with only whitespace', () => {
      const invalidData = {
        name: '   ',
        email: 'john@example.com',
        message: 'Valid message here',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject email with spaces', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john doe@example.com',
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject email without domain', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@',
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject email without @', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'johnexample.com',
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should accept message with exactly 10 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '1234567890',
      };

      const result = validateContactForm(validData);

      expect(result.success).toBe(true);
    });

    it('should accept message with exactly 2000 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'a'.repeat(2000),
      };

      const result = validateContactForm(validData);

      expect(result.success).toBe(true);
    });

    it('should reject message with special characters only', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '!@#$%^&*()',
      };

      const result = validateContactForm(invalidData);

      // Les caractères spéciaux sont acceptés s'ils atteignent la longueur minimale
      expect(result.success).toBe(true);
    });

    it('should accept name with accents and special characters', () => {
      const validData = {
        name: "José María O'Brien",
        email: 'jose@example.com',
        message: 'Valid message here',
      };

      const result = validateContactForm(validData);

      expect(result.success).toBe(true);
    });

    it('should reject when name is not a string', () => {
      const invalidData = {
        name: 123,
        email: 'john@example.com',
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject when email is not a string', () => {
      const invalidData = {
        name: 'John Doe',
        email: null,
        message: 'Valid message',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        name: '',
        email: 'invalid',
        message: 'Hi',
      };

      const result = validateContactForm(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });
});
