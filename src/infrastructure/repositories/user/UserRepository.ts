import { UserDatasource } from '@/infrastructure/datasource/user/UserDatasource';
import { UserMapper } from '@/infrastructure/mappers/user/UserMapper';
import { AuthResponse } from '@/domain/entities/user/AuthResponse';
import { UserLoginDto } from '@/infrastructure/models/user/UserModel';

export class UserRepository {
  static async login(credentials: UserLoginDto): Promise<AuthResponse> {
    try {
      const apiResponse = await UserDatasource.login(credentials);
      return UserMapper.fromAuthResponseToDomain(apiResponse);
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const apiResponse = await UserDatasource.refreshToken(refreshToken);
      return UserMapper.fromAuthResponseToDomain(apiResponse);
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(): Promise<any> {
    try {
      return await UserDatasource.getProfile();
    } catch (error) {
      throw error;
    }
  }
}