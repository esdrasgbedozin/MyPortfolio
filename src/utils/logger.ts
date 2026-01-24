/**
 * Logger structuré JSON pour production
 * Epic 3.3 - EF-042
 *
 * Format de log standardisé avec niveaux DEBUG, INFO, WARN, ERROR
 */

export interface LogEntry {
  timestamp: string; // ISO 8601
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: string; // Nom du module/fonction
  requestId?: string; // Trace ID pour corrélation
  userId?: string; // Si applicable
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Logger avec sortie JSON en production et pretty format en développement
 */
class Logger {
  /**
   * Méthode interne de logging
   */
  private log(level: LogEntry['level'], message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: metadata?.context as string | undefined,
      requestId: metadata?.requestId as string | undefined,
      error: metadata?.error as LogEntry['error'] | undefined,
      metadata,
    };

    // En production, envoyer JSON à stdout (parseable par Vercel/Datadog)
    // En dev, console.log lisible
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[${level}] ${message}`, metadata);
    }
  }

  /**
   * Log DEBUG - Informations de débogage détaillées
   * Uniquement activé si LOG_LEVEL=DEBUG
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    if (process.env.LOG_LEVEL === 'DEBUG') {
      this.log('DEBUG', message, metadata);
    }
  }

  /**
   * Log INFO - Événements normaux du système
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('INFO', message, metadata);
  }

  /**
   * Log WARN - Situations anormales mais gérées
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('WARN', message, metadata);
  }

  /**
   * Log ERROR - Erreurs nécessitant attention
   */
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('ERROR', message, {
      ...metadata,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }
}

/**
 * Instance globale du logger
 */
export const logger = new Logger();
