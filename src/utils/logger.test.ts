/**
 * Tests pour le Logger structuré JSON
 * Epic 3.3 - EF-041
 *
 * Tests RED pour valider le format de log JSON obligatoire
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, type LogEntry } from './logger';

describe('Logger - Epic 3.3 EF-041', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalLogLevel = process.env.LOG_LEVEL;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
    process.env.LOG_LEVEL = originalLogLevel;
  });

  describe('JSON Format Structure', () => {
    it('should log INFO messages with required JSON structure', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const message = 'Test info message';
      const metadata = { context: 'test', requestId: 'test-123' };

      // Act
      logger.info(message, metadata);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledOnce();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      expect(logEntry).toHaveProperty('timestamp');
      expect(logEntry).toHaveProperty('level', 'INFO');
      expect(logEntry).toHaveProperty('message', message);
      expect(logEntry).toHaveProperty('context', 'test');
      expect(logEntry).toHaveProperty('requestId', 'test-123');
      expect(logEntry).toHaveProperty('metadata');
      expect(logEntry.metadata).toEqual(metadata);
    });

    it('should log ERROR messages with error object', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const message = 'Test error message';
      const error = new Error('Test error');
      const metadata = { context: 'test', requestId: 'test-456' };

      // Act
      logger.error(message, error, metadata);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledOnce();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      expect(logEntry.level).toBe('ERROR');
      expect(logEntry.message).toBe(message);
      expect(logEntry.error).toBeDefined();
      expect(logEntry.error?.name).toBe('Error');
      expect(logEntry.error?.message).toBe('Test error');
      expect(logEntry.error?.stack).toBeDefined();
    });

    it('should log WARN messages', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const message = 'Test warning';

      // Act
      logger.warn(message);

      // Assert
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      expect(logEntry.level).toBe('WARN');
      expect(logEntry.message).toBe(message);
    });

    it('should log DEBUG messages only when LOG_LEVEL is DEBUG', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      process.env.LOG_LEVEL = 'DEBUG';
      const message = 'Debug message';

      // Act
      logger.debug(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledOnce();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      expect(logEntry.level).toBe('DEBUG');
      expect(logEntry.message).toBe(message);
    });

    it('should NOT log DEBUG messages when LOG_LEVEL is not set', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      delete process.env.LOG_LEVEL;

      // Act
      logger.debug('Should not appear');

      // Assert
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('Timestamp Format', () => {
    it('should use ISO 8601 format for timestamp', () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      // Act
      logger.info('Test timestamp');

      // Assert
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      // Validate ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ)
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      expect(logEntry.timestamp).toMatch(isoRegex);

      // Should be parseable as valid date
      const date = new Date(logEntry.timestamp);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  describe('Development Mode', () => {
    it('should use pretty format in development', () => {
      // Arrange
      process.env.NODE_ENV = 'development';
      const message = 'Dev log';
      const metadata = { test: 'value' };

      // Act
      logger.info(message, metadata);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO] ${message}`, metadata);
    });
  });

  describe('Optional Fields', () => {
    it('should handle missing metadata gracefully', () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      // Act
      logger.info('Message without metadata');

      // Assert
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      expect(logEntry.message).toBe('Message without metadata');
      expect(logEntry.context).toBeUndefined();
      expect(logEntry.requestId).toBeUndefined();
    });

    it('should handle error without error object', () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      // Act
      logger.error('Error without exception', undefined, { context: 'test' });

      // Assert
      const logOutput = consoleLogSpy.mock.calls[0][0];
      const logEntry: LogEntry = JSON.parse(logOutput);

      expect(logEntry.level).toBe('ERROR');
      expect(logEntry.error).toBeUndefined();
    });
  });
});
