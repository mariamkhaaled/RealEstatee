import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // 🔥 IMPORTANT FIX
    const user = data.data; 

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/profile");
    }

  } catch (err) {
    setError("Server error");
  }
};

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-custom border p-8">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Home className="text-primary-foreground" size={24} />
          </div>

          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full py-6">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;