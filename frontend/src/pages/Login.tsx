import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, ArrowLeft } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { pendingFavoriteId, addPendingFavorite, loadFavorites } = useFavorites();

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
        if (res.status === 403 && String(data.message || "").toLowerCase().includes("verify")) {
          navigate(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
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
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      window.dispatchEvent(new Event("user-updated"));

      await loadFavorites();

      if (pendingFavoriteId) {
        await addPendingFavorite();
        navigate("/favorites");
        return;
      }

      if (normalizedUser.role === "admin") navigate("/admin-dashboard");
      else if (normalizedUser.role === "owner") navigate("/owner-dashboard");
      else navigate("/profile");
      
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] font-sans selection:bg-[#c8a96e]/20">
      <div className="max-w-md w-full px-8 py-16">
        
        {/* Simple Brand Centering */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Home size={20} className="text-[#1a1814] group-hover:text-[#c8a96e] transition-colors" strokeWidth={1.5} />
            <span className="text-lg font-serif tracking-[0.2em] uppercase text-[#1a1814]">LuxeEstates</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif italic text-[#1a1814]">Welcome Back</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a9489] mt-3">Enter your credentials to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="group">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="group">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-[#e5e1da] py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#b0aaa0] font-light"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-[11px] text-red-400 italic text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-bold text-[#4e3b1f] transition-all duration-500 hover:scale-[1.01]"
              style={{ background: "#ede4cc" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "linear-gradient(135deg,#c8a96e 0%,#e8d4a8 50%,#c8a96e 100%)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#ede4cc"}
            >
              Sign In
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Link to="/reset-password"  className="text-[10px] uppercase tracking-widest text-[#9a9489] hover:text-[#1a1814] transition-colors">
              Forgotten Access?
            </Link>
            <p className="text-[11px] text-[#b0aaa0] font-light">
              New to the estate? <Link to="/register" className="text-[#1a1814] font-medium underline underline-offset-4 decoration-[#c8a96e]/30 hover:decoration-[#c8a96e]">Register </Link>
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
