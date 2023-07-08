export interface UserFromAuth {
  id: string;
  email: string;
  username: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserFromAuth;
  message?: string;
}

export interface AuthInput {
  email: string;
  password: string;
  username?: string;
}

export interface RefreshTokenResponse {
  accessToken: string,
  refreshToken: string;
}
