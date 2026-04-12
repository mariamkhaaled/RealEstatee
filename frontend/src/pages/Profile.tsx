import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, ShieldCheck, Heart, Home, LogOut, Eye } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-card rounded-3xl border border-border shadow-custom p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-primary mb-6">
            <User size={28} />
          </div>
          <h1 className="text-2xl font-bold">No profile data found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Please sign in or register to access your profile.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-custom">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground text-3xl font-semibold">
              {initials}
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">Profile</p>
              <h1 className="text-3xl font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              <Badge className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-foreground">
                <ShieldCheck size={14} /> {user.role}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-secondary p-5">
              <p className="text-sm text-muted-foreground">Account status</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-foreground">Active</p>
                <Badge className="rounded-full bg-green-50 text-green-700 border-green-200">Verified</Badge>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-5">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Home size={16} />
                <span>Member since 2026</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-foreground">
                <p>{user.email}</p>
                <p className="text-muted-foreground">Your profile is secured locally in the browser.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2" size={16} /> Log out
            </Button>
            <Link to="/properties">
              <Button className="w-full">Browse Properties</Button>
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-custom">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Welcome back, {user.firstName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your profile is ready. Manage your account, saved favorites, and property activity from one place.
                </p>
              </div>
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                <Badge className="rounded-full bg-secondary px-4 py-2 text-sm text-foreground">Customer</Badge>
                <Badge className="rounded-full bg-secondary px-4 py-2 text-sm text-foreground">Secure Session</Badge>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Favorites", value: "24", icon: Heart },
                { label: "Viewed", value: "12", icon: Eye },
                { label: "Listings", value: "3", icon: Home },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border bg-background p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon size={20} />
                  </div>
                  <p className="text-3xl font-semibold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-custom">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Account details</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your profile information is stored locally and can be updated anytime.</p>
              </div>
              <Badge className="rounded-full bg-secondary px-3 py-2 text-sm text-foreground">Secure</Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">First name</p>
                <p className="mt-2 text-lg font-medium text-foreground">{user.firstName}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Last name</p>
                <p className="mt-2 text-lg font-medium text-foreground">{user.lastName}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-2 text-lg font-medium text-foreground">{user.email}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</p>
                <p className="mt-2 text-lg font-medium text-foreground">{user.role}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
