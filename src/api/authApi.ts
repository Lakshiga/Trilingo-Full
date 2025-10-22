import { apiClient } from "./apiClient";
import { AuthResponse } from "../types/auth";
import { LoginRequest } from "../types/auth";

/**
 * Logs in a user.
 * @param credentials The username and password.
 * @returns A promise that resolves with the auth response, including tokens.
 */
export const login = (credentials: LoginRequest): Promise<AuthResponse> => {
  // The apiClient will automatically handle the response wrapping and error handling
  return apiClient.post<AuthResponse, typeof credentials>('/auth/login', credentials);

};
