import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiError {
  error: string;
  statusCode?: number;
}

const TOKEN_KEY = '@sisrev:token';

export class ApiService {
  private static async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      console.log(`[ApiService] Making ${options.method || 'GET'} request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: text || 'Erro desconhecido' };
        }
      }

      if (!response.ok) {
        console.error(`[ApiService] Error response:`, data);
        throw {
          error: data.error || data.message || 'Erro na requisição',
          statusCode: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
      if (error && typeof error === 'object' && 'error' in error) {
        throw error as ApiError;
      }
      
      // Erro de rede ou conexão
      console.error(`[ApiService] Network error:`, error);
      throw {
        error: error instanceof Error ? error.message : 'Erro de conexão. Verifique se o servidor está rodando e a URL está correta.',
        statusCode: 0,
      } as ApiError;
    }
  }

  // Auth
  static async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'ALUNO' | 'PROFESSOR';
    disciplineId?: string;
  }) {
    return this.request<{ token: string; user: any }>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Laboratories
  static async getLaboratories() {
    return this.request<any[]>(API_ENDPOINTS.LABORATORIES);
  }

  static async getLaboratoryById(id: string) {
    return this.request<any>(API_ENDPOINTS.LABORATORY_BY_ID(id));
  }

  // Disciplines
  static async getDisciplines() {
    return this.request<any[]>(API_ENDPOINTS.DISCIPLINES);
  }

  static async getDisciplineById(id: string) {
    return this.request<any>(API_ENDPOINTS.DISCIPLINE_BY_ID(id));
  }

  // Reservations
  static async getReservations() {
    return this.request<any[]>(API_ENDPOINTS.RESERVATIONS);
  }

  static async getReservationById(id: string) {
    return this.request<any>(API_ENDPOINTS.RESERVATION_BY_ID(id));
  }

  static async createReservation(data: {
    laboratoryId: string;
    disciplineId?: string;
    startDate: string;
    endDate: string;
    description?: string;
  }) {
    return this.request<any>(API_ENDPOINTS.RESERVATIONS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateReservation(id: string, data: Partial<{
    startDate: string;
    endDate: string;
    description: string;
    disciplineId: string;
  }>) {
    return this.request<any>(API_ENDPOINTS.RESERVATION_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async cancelReservation(id: string) {
    return this.request<any>(API_ENDPOINTS.RESERVATION_BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Users
  static async getProfile() {
    return this.request<any>(API_ENDPOINTS.PROFILE);
  }

  static async updateProfile(data: { name?: string }) {
    return this.request<any>(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  static async getNotifications(unreadOnly?: boolean) {
    const query = unreadOnly ? '?unreadOnly=true' : '';
    return this.request<any[]>(`${API_ENDPOINTS.NOTIFICATIONS}${query}`);
  }

  static async markNotificationAsRead(id: string) {
    return this.request<any>(API_ENDPOINTS.MARK_NOTIFICATION_READ(id), {
      method: 'PUT',
    });
  }
}
