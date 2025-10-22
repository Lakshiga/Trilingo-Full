export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token: string | null;
  refreshToken: string | null;
}
