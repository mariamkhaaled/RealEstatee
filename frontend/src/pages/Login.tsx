import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useUser } from "@/context/UserContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { pendingFavoriteId, addPendingFavorite, loadFavorites } =
    useFavorites();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const normalizedEmail = email.trim().toLowerCase();
        if (
          res.status === 403 &&
          String(data.message || "").toLowerCase().includes("verify")
        ) {
          navigate(
            `/verify-email?email=${encodeURIComponent(normalizedEmail)}`
          );
          return;
        }
        setError(data.message || "Login failed");
        return;
      }

      const user = data.data;
      const normalizedUser = {
        ...user,
        role: String(user?.role || "").toLowerCase(),
      };

      localStorage.setItem("token", data.token);
      setUser(normalizedUser);
      window.dispatchEvent(new Event("user-updated"));

      await loadFavorites();

      if (pendingFavoriteId) {
        await addPendingFavorite();
        navigate("/favorites");
        return;
      }

      if (normalizedUser.role === "admin") navigate("/admin-dashboard");
      else if (normalizedUser.role === "owner")
        navigate("/owner-dashboard");
      else navigate("/profile");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f0ea] relative overflow-hidden font-sans">

      {/* OUTER FRAME */}

      {/* INNER RECTANGLE FRAME */}
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
              Luxury Real Estate Platform
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Login Form) */}
        <div className="flex flex-1 items-center justify-center px-10">
          <div className="w-full max-w-sm">

            <div className="text-center mb-10">
              <h1 className="text-3xl font-serif italic text-[#1a1814]">
                Welcome Back
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a9489] mt-3">
                Enter your credentials
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] placeholder:text-[#b0aaa0]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] placeholder:text-[#b0aaa0]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p className="text-[11px] text-red-400 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-bold text-[#2a1f0e] transition-all"
                style={{
                  background:
                    "linear-gradient(135deg,#c8a96e,#e8d4a8)",
                }}
              >
                Sign In
              </button>
            </form>

            <div className="text-center mt-8 space-y-3">
              <Link
                to="/reset-password"
                className="text-[10px] uppercase tracking-widest text-[#9a9489]"
              >
                Forgotten Access?
              </Link>

              <p className="text-[11px] text-[#b0aaa0]">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-[#1a1814] underline"
                >
                  Register
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;