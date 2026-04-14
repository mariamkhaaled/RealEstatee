import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import OTPVerification from "@/components/OTPVerification";
import PasswordInput from "@/components/PasswordInput";
import { forgotPassword, resetPassword } from "@/api";
import { Mail, Lock, ArrowLeft } from "lucide-react";

type ResetStep = "email" | "otp" | "password";

interface ResetPasswordPageProps {
  onBack?: () => void;
}

/**
 * ResetPassword Page - 3-Step Wizard Flow
 * Step 1: Enter email to receive OTP
 * Step 2: Verify OTP code (6-digit)
 * Step 3: Enter new password
 */
const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  // Step management
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Handle Step 1: Email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Reset code sent to your email!");
      setStep("otp");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to send reset code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: OTP verification
  const handleOTPComplete = (code: string) => {
    setOtp(code);
    // Automatically move to password step
    setTimeout(() => setStep("password"), 500);
  };

  // Handle Step 3: Password reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Please enter both passwords");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password reset failed";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  // Handle going back to previous step
  const handleBackStep = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
      setError(null);
    } else if (step === "password") {
      setStep("otp");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-white to-gray-50">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-custom border p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
              {step === "email" && (
                <Mail className="text-[#002347]" size={32} strokeWidth={1.5} />
              )}
              {step === "otp" && (
                <Mail className="text-[#002347]" size={32} strokeWidth={1.5} />
              )}
              {step === "password" && (
                <Lock className="text-[#002347]" size={32} strokeWidth={1.5} />
              )}
            </div>

            <h2 className="text-3xl font-bold text-black mb-3">
              {step === "email" && "Reset Password"}
              {step === "otp" && "Verify Code"}
              {step === "password" && "New Password"}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed">
              {step === "email" &&
                "Enter your email address and we'll send you a code to reset your password"}
              {step === "otp" &&
                `We sent a 6-digit code to ${email}. Enter it below.`}
              {step === "password" && "Create a new password for your account"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmailSubmit}
                className="space-y-6"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#002347]/20 focus:border-[#002347] transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#002347] text-white rounded-lg font-semibold hover:bg-[#001a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </motion.form>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <OTPVerification
                    onComplete={handleOTPComplete}
                    disabled={loading}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleBackStep}
                  className="w-full py-2 text-[#002347] hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                >
                  <ArrowLeft size={16} className="inline mr-2" />
                  Back to Email
                </button>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handlePasswordSubmit}
                className="space-y-6"
              >
                <PasswordInput
                  label="New Password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#002347] text-white rounded-lg font-semibold hover:bg-[#001a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={handleBackStep}
                  className="w-full py-2 text-[#002347] hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                >
                  <ArrowLeft size={16} className="inline mr-2" />
                  Back to Code
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm border-t pt-6">
            <p className="text-gray-600">
              {step === "otp" && "Changed your mind?"}{" "}
              {step === "password" && "Already logged in?"}{" "}
              {(step === "otp" || step === "password") && (
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#002347] hover:underline font-semibold"
                >
                  Login here
                </button>
              )}
            </p>
          </div>

          {/* External Back Button */}
          {onBack && step === "email" && (
            <button
              onClick={onBack}
              className="w-full mt-6 py-2 text-[#002347] hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>
      </motion.div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#002347]/20 border-t-[#002347] rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#002347]">
              {step === "email" && "Sending code..."}
              {step === "otp" && "Verifying..."}
              {step === "password" && "Resetting password..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
