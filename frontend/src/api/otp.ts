import { fetchWrapper, ApiResponse } from "./utils/fetchWrapper";

export interface OTPUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface OTPResponse extends ApiResponse {
  token?: string;
  data?: OTPUserData;
}

export type PasswordResetResponse = ApiResponse;

export const verifyOTP = async (
  email: string,
  otp: string,
): Promise<OTPResponse> => {
  return (await fetchWrapper<OTPUserData>("/otp/verify", {
    method: "POST",
    body: { email: email.toLowerCase().trim(), otp },
  })) as OTPResponse;
};

export const resendOTP = async (email: string): Promise<OTPResponse> => {
  return (await fetchWrapper<OTPUserData>("/otp/resend", {
    method: "POST",
    body: { email: email.toLowerCase().trim() },
  })) as OTPResponse;
};

export const forgotPassword = async (
  email: string,
): Promise<PasswordResetResponse> => {
  return fetchWrapper<PasswordResetResponse>("/otp/forgot-password", {
    method: "POST",
    body: { email: email.toLowerCase().trim() },
  });
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
): Promise<PasswordResetResponse> => {
  return fetchWrapper<PasswordResetResponse>("/otp/reset-password", {
    method: "POST",
    body: { email: email.toLowerCase().trim(), otp, newPassword },
  });
};
