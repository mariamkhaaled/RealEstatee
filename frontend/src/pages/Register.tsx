import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import VerifyOTP from "./VerifyOTP";

const Register: React.FC = () => {
  // Registration form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("owner");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP flow state
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const shinyGoldGradient = "bg-gradient-to-tr from-[#c5a367] via-[#d4af37] to-[#b88a44]";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim().toLowerCase(),
          password,
          phone: "0000000000",
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      toast.success(`Signup successful! Check ${email} for your verification code.`);
      setOtpEmail(email.trim().toLowerCase());
      setShowOTPStep(true);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showOTPStep) {
    return <VerifyOTP email={otpEmail} onBack={() => setShowOTPStep(false)} />;
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] font-sans selection:bg-[#c8a96e]/20 relative overflow-hidden">
    
    {/* زر العودة الأنيق */}
    <Link 
      to="/" 
      className="absolute top-8 left-8 flex items-center gap-2 text-[#9a9489] hover:text-[#1a1814] transition-colors text-[10px] uppercase tracking-[0.2em] font-bold z-20"
    >
      <ArrowLeft size={14} /> Back to Home
    </Link>

    {/* الحاوية أصبحت بدون خلفية بيضاء وبدون ظل ثقيل */}
    <div className="max-w-lg w-full px-8 py-16 relative z-10">
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-light italic text-[#1a1814] mb-3">Join the Collective</h2>
        <div className="h-[1px] w-12 bg-[#c8a96e] mx-auto mb-4" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a9489]">Exclusive Property Access</p>
      </div>

      <form className="space-y-10" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-8">
          <input
            placeholder="First Name"
            className="bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            placeholder="Last Name"
            className="bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative group">
          <select
            className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] appearance-none font-light text-[#706c61] cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Admin</option>
            <option value="owner">Property Owner</option>
          </select>
          <span className="absolute right-0 bottom-3 text-[10px] text-[#c8a96e] pointer-events-none">▼</span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm"
            className="bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-[10px] text-red-400 italic text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-5  text-[11px] uppercase tracking-[0.3em] font-bold text-[#4e3b1f] transition-all duration-500 hover:scale-[1.01] shadow-sm"
          style={{ background: "#ede4cc" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg,#c8a96e 0%,#e8d4a8 50%,#c8a96e 100%)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ede4cc";
            e.currentTarget.style.color = "#4e3b1f";
          }}
        >
          Create Account
        </button>
      </form>

      <p className="mt-12 text-center text-[11px] text-[#9a9489] font-light">
        Already Registered?{" "}
        <Link to="/login" className="text-[#1a1814] font-medium underline underline-offset-4 decoration-[#c8a96e]/30 hover:decoration-[#c8a96e] transition-colors">
          Login
        </Link>
      </p>
    </div>
  </div>
);
}
export default Register;
