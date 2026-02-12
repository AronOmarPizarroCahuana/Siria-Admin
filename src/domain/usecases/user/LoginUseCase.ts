import { UserRepository } from '@/infrastructure/repositories/user/UserRepository';
import { AuthResponse } from '@/domain/entities/user/AuthResponse';
import { UserLoginDto } from '@/infrastructure/models/user/UserModel';

export class LoginUseCase {
  static async execute(credentials: UserLoginDto): Promise<AuthResponse> {
    try {
      // Ejecutar el login
      const authResponse = await UserRepository.login(credentials);

      // Guardar tokens en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authResponse.accessToken);
        localStorage.setItem('refresh_token', authResponse.refreshToken);
        
        // Solo guardar user si existe
        if (authResponse.user) {
          localStorage.setItem('user', JSON.stringify(authResponse.user));
        }
      }

      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  static getStoredUser(): any {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}