import { UserLoginDto } from '@/infrastructure/models/user/UserModel';
import { ApiAuthResponse } from '@/domain/entities/user/AuthResponse';

export class UserDatasource {
  private static getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.meta?.message || data.message || 'Error en la petición');
    }
    
    return data;
  }

  static async login(credentials: UserLoginDto): Promise<ApiAuthResponse> {
    console.log('Login URL:', `${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
    console.log('Login credentials:', { email: credentials.email, password: '***' });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(credentials),
    });
    
    return this.handleResponse<ApiAuthResponse>(response);
  }

  static async refreshToken(refreshToken: string): Promise<ApiAuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return this.handleResponse<ApiAuthResponse>(response);
  }

  static async getProfile(): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }
}