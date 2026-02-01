/**
 * API Client Service - Epic 6.1 (FE-075)
 *
 * Wrapper autour de fetch pour :
 * - Gestion centralisée des erreurs
 * - Configuration base URL
 * - Headers communs
 * - Type safety avec TypeScript
 *
 * @module services/api
 */

/**
 * API Error avec détails HTTP
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Configuration du client API
 */
interface ApiClientConfig {
  baseUrl: string;
  headers?: HeadersInit;
}

/**
 * Options pour les requêtes API
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Client API avec méthodes HTTP
 */
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Requête HTTP générique avec gestion d'erreurs
   */
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = 10000, headers, ...fetchOptions } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si la réponse n'est pas OK (status 200-299), throw error
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408, 'Request Timeout');
        }
        throw new ApiError(error.message, 0, 'Network Error');
      }

      throw new ApiError('Unknown error', 0, 'Unknown Error');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

/**
 * Factory pour créer une instance du client API
 * Utilise la variable d'environnement PUBLIC_API_URL
 */
export function createApiClient(baseUrl?: string): ApiClient {
  const apiBaseUrl = baseUrl || import.meta.env.PUBLIC_API_URL || 'http://localhost:4010/api';

  return new ApiClient({ baseUrl: apiBaseUrl });
}

/**
 * Instance par défaut du client API
 * Utilisable dans toute l'application
 */
export const api = createApiClient();
