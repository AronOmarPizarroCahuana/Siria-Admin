export interface UserLoginDto {
    email: string;
    password: string;
  }
  
  export interface UserResponseDto {
    dni: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: boolean;
  }
  
  export interface AuthTokens {
    access_token: string;
    refresh_token: string;
  }