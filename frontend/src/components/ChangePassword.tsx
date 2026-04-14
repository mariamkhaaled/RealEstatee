import { useState, useCallback } from "react";
import { Eye, EyeOff, Loader, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { changePassword, forgotPassword, resetPassword } from "@/api";
import OTPVerification from "@/components/OTPVerification";

type ChangePasswordStep = "main" | "forgot-otp" | "forgot-reset";

interface ChangePasswordProps {
  onBack?: () => void;
}

export default function ChangePassword({ onBack }: ChangePasswordProps) {
  // Get email from localStorage
  const userEmail =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}").email
      : "";

  // Main password change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot password flow state
  const [step, setStep] = useState<ChangePasswordStep>("main");
  const [otp, setOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] =
    useState(false);

  const validateMainPasswords = useCallback(() => {
    if (!currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      return false;
    }
    return true;
  }, [currentPassword, newPassword, confirmPassword]);

  const validateForgotPasswords = useCallback(() => {
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  }, [forgotNewPassword, forgotConfirmPassword]);

  // Handle main password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateMainPasswords()) return;

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);

      toast.success("Password changed successfully! Returning to profile...");
      setTimeout(() => {
        onBack?.(); 
      }, 1500);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while changing password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Start forgot password flow
  const handleStartForgotPassword = async () => {
    setError("");
    setLoading(true);
    try {
      await forgotPassword(userEmail);
      setStep("forgot-otp");
      toast.success("OTP sent to your email!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset code";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP completion
  const handleOTPComplete = (otpCode: string) => {
    setOtp(otpCode);
    setError("");
    setStep("forgot-reset");
    toast.success("OTP verified! Now set your new password.");
  };

  // Complete forgot password reset
  const handleCompleteForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForgotPasswords()) return;

    setLoading(true);
    try {
      await resetPassword(userEmail, otp, forgotNewPassword);

      toast.success("Password reset successfully! Returning to Profile...");
      // Reset all states
      setStep("main");
      setOtp("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Return to Profile after 1.5 seconds
      setTimeout(() => {
        onBack?.();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-10 shadow-md border border-[#e0e0e0]"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#002347] mb-2">
              Change Password
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Update your password to keep your account secure
            </p>

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#002347] focus:ring-2 focus:ring-[#002347]/10 transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#002347] transition"
                    disabled={loading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#002347] focus:ring-2 focus:ring-[#002347]/10 transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#002347] transition"
                    disabled={loading}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#002347] focus:ring-2 focus:ring-[#002347]/10 transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#002347] transition"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002347] text-white py-3 rounded-lg font-semibold hover:bg-[#001835] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-[#e0e0e0]">
              <p className="text-center text-sm text-gray-600">
                Forgot your current password?{" "}
                <button
                  onClick={handleStartForgotPassword}
                  className="text-[#002347] hover:underline font-semibold disabled:opacity-50"
                  disabled={loading}
                >
                  Reset here
                </button>
              </p>
            </div>

            {/* Back Button */}
            {onBack && (
              <button
                onClick={onBack}
                className="mt-6 flex items-center gap-2 text-[#002347] hover:text-[#001835] font-semibold transition"
              >
                <ArrowLeft size={18} />
                Back to Profile
              </button>
            )}
          </motion.div>
        )}

        {step === "forgot-otp" && (
          <motion.div
            key="forgot-otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-10 shadow-md border border-[#e0e0e0]"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#002347] mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Enter the 6-digit code sent to {userEmail}
            </p>

            {/* OTP Input */}
            <div className="mb-6">
              <OTPVerification
                onComplete={handleOTPComplete}
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => {
                setStep("main");
                setError("");
                setOtp("");
              }}
              className="flex items-center gap-2 text-[#002347] hover:text-[#001835] font-semibold transition disabled:opacity-50"
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back to Password Change
            </button>
          </motion.div>
        )}

        {step === "forgot-reset" && (
          <motion.div
            key="forgot-reset"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-10 shadow-md border border-[#e0e0e0]"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#002347] mb-2">
              Set New Password
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Create a new password for your account
            </p>

            {/* Form */}
            <form onSubmit={handleCompleteForgotReset} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showForgotNewPassword ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#002347] focus:ring-2 focus:ring-[#002347]/10 transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowForgotNewPassword(!showForgotNewPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#002347] transition"
                    disabled={loading}
                  >
                    {showForgotNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showForgotConfirmPassword ? "text" : "password"}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#002347] focus:ring-2 focus:ring-[#002347]/10 transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowForgotConfirmPassword(!showForgotConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#002347] transition"
                    disabled={loading}
                  >
                    {showForgotConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002347] text-white py-3 rounded-lg font-semibold hover:bg-[#001835] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            {/* Back Button */}
            <button
              onClick={() => {
                setStep("forgot-otp");
                setError("");
              }}
              className="mt-6 flex items-center gap-2 text-[#002347] hover:text-[#001835] font-semibold transition disabled:opacity-50"
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back to Verification
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
