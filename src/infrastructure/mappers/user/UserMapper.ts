import { User } from '@/domain/entities/user/User';
import { UserResponseDto } from '@/infrastructure/models/user/UserModel';
import { AuthResponse, ApiAuthResponse } from '@/domain/entities/user/AuthResponse';

export class UserMapper {
  static fromApiToDomain(apiUser: UserResponseDto): User {
    return {
      dni: apiUser.dni,
      firstName: apiUser.first_name,
      lastName: apiUser.last_name,
      email: apiUser.email,
      gender: apiUser.gender,
    };
  }

  static fromAuthResponseToDomain(apiResponse: ApiAuthResponse): AuthResponse {
    console.log('Mapping auth response:', apiResponse);

    if (!apiResponse.token || !apiResponse.token.access_token) {
      console.error('Invalid auth response structure:', apiResponse);
      throw new Error('No hay tokens en la respuesta de autenticación');
    }

    return {
      accessToken: apiResponse.token.access_token,
      refreshToken: apiResponse.token.refresh_token,
      user: apiResponse.user ? this.fromApiToDomain(apiResponse.user) : null,
    };
  }
}