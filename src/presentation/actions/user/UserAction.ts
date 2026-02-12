'use server';

import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase'; 
import { UserLoginDto } from '@/infrastructure/models/user/UserModel';

export async function loginAction(credentials: UserLoginDto) {
  try {
    const result = await LoginUseCase.execute(credentials);
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al iniciar sesión',
    };
  }
}