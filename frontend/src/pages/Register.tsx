import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${firstName} ${lastName}`,
          email: email.trim().toLowerCase(),
          password,
          phone: "0000000000",
          role: "customer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f0ea] relative overflow-hidden font-sans">

      {/* OUTER FRAME */}
      <div className="relative w-full max-w-5xl h-[600px] border border-[rgba(200,169,110,0.35)] bg-[rgba(255,253,248,0.92)] backdrop-blur-xl shadow-[0_30px_80px_rgba(200,169,110,0.12)] flex">

        {/* LEFT SIDE (Brand Panel) */}
        <div className="hidden md:flex flex-1 items-center justify-center border-r border-[rgba(200,169,110,0.2)]">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home size={20} className="text-[#c8a96e]" />
              <span className="text-lg font-serif tracking-[0.2em] uppercase text-[#1a1814]">
                LuxeEstates
              </span>
            </Link>

            <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-[#9a9489]">
              Join Our Exclusive Platform
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Register Form) */}
        <div className="flex flex-1 items-center justify-center px-10">
          <div className="w-full max-w-sm">

            <div className="text-center mb-10">
              <h1 className="text-3xl font-serif italic text-[#1a1814]">
                Create Account
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a9489] mt-3">
                Join the luxury experience
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>

              {/* TWO SIDE-BY-SIDE FIELDS */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First Name"
                  className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e]"
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                  placeholder="Last Name"
                  className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e]"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e]"
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* PASSWORD ROW */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e]"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm"
                  className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e]"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-[11px] text-red-400 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-bold text-[#2a1f0e]"
                style={{
                  background: "linear-gradient(135deg,#c8a96e,#e8d4a8)",
                }}
              >
                Create Account
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-[11px] text-[#b0aaa0]">
                Already have an account?{" "}
                <Link to="/login" className="text-[#1a1814] underline">
                  Login
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;