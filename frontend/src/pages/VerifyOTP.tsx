import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import OTPVerification from "@/components/OTPVerification";
import { Button } from "@/components/ui/button";
import { verifyOTP, resendOTP } from "@/api";
import { Mail, ArrowLeft, RotateCw } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

interface VerifyOTPProps {
  email?: string;
  onBack?: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ email, onBack }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryEmail = searchParams.get("email") || "";
  const targetEmail = (email || queryEmail).trim().toLowerCase();
  const { pendingFavoriteId, addPendingFavorite } = useFavorites();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Timer countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle OTP submission
  const handleOTPComplete = async (otpCode: string) => {
    if (!targetEmail) {
      const message =
        "Missing email. Please login again to continue verification.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await verifyOTP(targetEmail, otpCode);

      // Show success message
      toast.success("Email verified! Logging you in...");

      // Save token and user to localStorage
      if (response.token && response.data) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // Small delay for UX smoothness
        setTimeout(async () => {
          // إذا كان هناك عقار معلق، أضفه للمفضلات
          if (pendingFavoriteId) {
            await addPendingFavorite();
            navigate("/favorites");
          } else {
            // Redirect based on user role
            const role = response.data?.role;
            if (role === "admin") {
              navigate("/admin-dashboard");
            } else if (role === "owner") {
              navigate("/owner-dashboard");
            } else {
              navigate("/home");
            }
          }
        }, 500);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend || resendTimer > 0) return;
    if (!targetEmail) {
      const message =
        "Missing email. Please login again to request a new code.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    try {
      await resendOTP(targetEmail);
      toast.success("OTP sent to your email!");

      // Start 60-second timer
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full bg-card rounded-2xl shadow-custom border p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <Mail className="text-[#002347]" size={32} strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-bold text-black mb-3">
            Verify Your Email
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold text-gray-700">
              {targetEmail || "your email"}
            </span>
            <br />
            Enter it below to complete your registration
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="mb-10">
          <OTPVerification onComplete={handleOTPComplete} disabled={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm font-medium">{error}</p>
            <p className="text-red-500 text-xs mt-1">
              Please check your code and try again
            </p>
          </motion.div>
        )}

        {/* Resend Section */}
        <div className="border-t pt-8 flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-4">Didn't receive the code?</p>

          <button
            onClick={handleResendOTP}
            disabled={!canResend || resendTimer > 0 || loading}
            className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300
              ${
                resendTimer > 0 || !canResend
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#002347] hover:text-[#001a35] hover:underline cursor-pointer"
              }
            `}
          >
            <RotateCw size={16} />
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </button>

          {resendTimer > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              For security, wait before requesting a new code
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            navigate("/login");
          }}
          className="w-full flex items-center justify-center gap-2 text-[#002347] hover:text-[#001a35] hover:bg-blue-50 py-3 rounded-lg transition-all duration-200 text-sm font-medium mt-6"
        >
          <ArrowLeft size={16} />
          {onBack ? "Back to Registration" : "Back to Login"}
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#002347]/20 border-t-[#002347] rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#002347]">Verifying...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VerifyOTP;
