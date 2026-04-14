import React, { useRef, useState, useCallback } from "react";

interface OTPVerificationProps {
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  onComplete,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      // Only accept digits
      const digit = value.replace(/\D/g, "");

      if (digit.length > 1) {
        // Paste scenario - fill multiple boxes
        const digitsArray = digit.slice(0, 6).split("");
        const newOtp = [...otp];

        digitsArray.forEach((d, idx) => {
          if (index + idx < 6) {
            newOtp[index + idx] = d;
          }
        });

        setOtp(newOtp);

        // Auto-focus to next empty input or last filled+1
        const nextEmptyIndex = newOtp.findIndex(
          (d, idx) => idx > index && d === "",
        );
        const focusIndex =
          nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + 5, 5);
        inputRefs.current[focusIndex]?.focus();

        // If all filled, trigger complete
        if (newOtp.every((d) => d !== "")) {
          onComplete(newOtp.join(""));
        }
      } else if (digit) {
        // Single digit entry
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        // Auto-focus to next box
        if (index < 5) {
          inputRefs.current[index + 1]?.focus();
        }

        // If all filled, trigger complete
        if (newOtp.every((d) => d !== "")) {
          onComplete(newOtp.join(""));
        }
      } else {
        // Clear scenario (empty input)
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    },
    [otp, onComplete],
  );

  /**
   * Handle backspace and arrow keys
   * Backspace on current input → clear + move to previous
   * Backspace on empty input → move to previous + clear it
   */
  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newOtp = [...otp];

        if (otp[index]) {
          // If current box has value, clear it
          newOtp[index] = "";
          setOtp(newOtp);
        } else if (index > 0) {
          // If current box is empty, clear previous and focus it
          newOtp[index - 1] = "";
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        // Allow arrow left navigation
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < 5) {
        // Allow arrow right navigation
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  /**
   * Handle focus event
   * Ensure inputs are filled sequentially
   */
  const handleFocus = useCallback((index: number) => {
    // Index is already focused, highlight it visually
    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className="flex gap-4 justify-center items-center">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`w-14 h-14 text-2xl font-bold text-center border-2 rounded-lg transition-all duration-200 outline-none
              ${
                otp[index]
                  ? "border-[#002347] bg-white"
                  : "border-[#e0e0e0] bg-white hover:border-[#002347]"
              }
              focus:border-[#002347] focus:ring-2 focus:ring-[#002347]/20 focus:bg-white
              disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              text-black placeholder-gray-300
            `}
            placeholder="•"
            aria-label={`OTP digit ${index + 1} of 6`}
          />
        ))}
    </div>
  );
};

export default OTPVerification;
