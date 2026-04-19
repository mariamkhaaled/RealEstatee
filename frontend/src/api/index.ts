/**
 * Clean API Module Export
 * Single source of truth for all API calls
 */

// Auth APIs
export {
  changePassword,
  type AuthUser,
  type AuthResponse,
  type ChangePasswordResponse,
} from "./auth";

// OTP APIs
export {
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  type OTPUserData,
  type OTPResponse,
  type PasswordResetResponse,
} from "./otp";

// Inquiry APIs
export {
  getInquiries,
  createInquiry,
  type InquiryItem,
  type CreateInquiryPayload,
} from "./inquiries";

// Message APIs
export {
  getInquiryMessages,
  sendMessage,
  type MessageItem,
  type SendMessagePayload,
} from "./messages";
