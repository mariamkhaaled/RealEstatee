import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Heart, Home, LogOut, Eye, User } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  photo?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as UserData;
    } catch {
      return null;
    }
  });
  const [photo, setPhoto] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      const parsed = JSON.parse(storedUser) as UserData;
      return parsed.photo || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch profile data from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === "success") {
            setUser(data.data as UserData);
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setPhoto(imageData);

      if (user) {
        const updatedUser = { ...user, photo: imageData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

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
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-custom">
            <div className="flex flex-col items-center gap-5 text-center">
              <Avatar className="h-28 w-28 rounded-[32px] border border-border bg-secondary">
                {photo ? (
                  <AvatarImage src={photo} alt={`${user.firstName} ${user.lastName}`} />
                ) : (
                  <AvatarFallback className="text-foreground">{initials}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Your profile</p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                  <ShieldCheck size={14} /> {user.role}
                </Badge>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-secondary/80 p-5">
                <p className="text-sm text-muted-foreground">Account status</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">Active</p>
                  <Badge className="rounded-full bg-green-50 text-green-700 border-green-200">Verified</Badge>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="mt-2 text-lg font-semibold text-foreground">2026</p>
                <p className="mt-3 text-sm text-muted-foreground">Profile data is stored locally in your browser.</p>
              </div>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button variant="outline" className="w-full" onClick={handleChoosePhoto}>
                  Change photo
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-custom">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Welcome back</p>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">Hi, {user.firstName}.</h2>
                </div>
                <Link to="/properties">
                  <Button variant="outline">Browse Properties</Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Manage your profile, saved favorites, and property activity in one place.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Favorites", value: "24", icon: Heart },
                  { label: "Viewed", value: "12", icon: Eye },
                  { label: "Listings", value: "3", icon: Home },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-border bg-secondary/70 p-5 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon size={20} />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-custom">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Account details</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">Profile information</h3>
                </div>
                <Badge className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground">Secure</Badge>
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

            <div className="rounded-3xl border border-border bg-card p-6 shadow-custom">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Quick access</p>
                <Badge className="rounded-full bg-primary text-primary-foreground text-sm">Fast</Badge>
              </div>
              <div className="mt-6 grid gap-3">
                <Link to="/favorites" className="rounded-2xl border border-border bg-secondary p-4 text-sm text-foreground transition hover:bg-secondary/90">
                  View saved favorites
                </Link>
                <Link to="/properties" className="rounded-2xl border border-border bg-secondary p-4 text-sm text-foreground transition hover:bg-secondary/90">
                  Explore new listings
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
    </div>
  );
};

export default Profile;
