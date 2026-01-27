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
      
      
