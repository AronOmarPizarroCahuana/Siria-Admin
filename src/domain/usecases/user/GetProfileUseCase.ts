import { UserRepository } from '@/infrastructure/repositories/user/UserRepository';

export class GetProfileUseCase {
  static async execute(): Promise<any> {
    try {
      return await UserRepository.getProfile();
    } catch (error) {
      throw error;
    }
  }
}