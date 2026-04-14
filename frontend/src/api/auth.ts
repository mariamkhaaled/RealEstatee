import { fetchWrapper, ApiResponse } from "./utils/fetchWrapper";

/**
 * Auth API Response Types
 */
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photo?: string;
}

export interface AuthResponse extends ApiResponse {
  token?: string;
  data?: AuthUser;
}

export type ChangePasswordResponse = ApiResponse;

/**
 * Change password for logged-in user
 * Requires current password verification
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResponse> => {
  return fetchWrapper<ChangePasswordResponse>("/user/change-password", {
    method: "POST",
    body: {
      currentPassword,
      newPassword,
    },
  });
};
