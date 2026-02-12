import { User } from './User';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User | null;
}

export interface ApiAuthResponse {
  meta: {
    status: boolean;
    message: string;
  };
  token: {
    access_token: string;
    access_expires: string;
    refresh_token: string;
    refresh_expires: string;
  };
  user?: {
    dni: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: boolean;
  };
}