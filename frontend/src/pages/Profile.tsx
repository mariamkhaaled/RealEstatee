import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck,
  Heart,
  Home,
  LogOut,
  Eye,
  User,
} from "lucide-react";
import ChangePassword from "@/components/ChangePassword";
import { useFavorites } from "@/context/FavoritesContext";

/* ───────── Fonts ───────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
);

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [user, setUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [photo, setPhoto] = useState<string | null>(user?.photo || null);

  const { clearFavorites } = useFavorites();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.status === "success") {
          const u = data.data as UserData;
          setUser(u);
          setPhoto(u.photo || null);
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div style={styles.page}>
        <FontLink />
        <div style={styles.centerCard}>
          <User size={28} color="#c8a96e" />
          <h2 style={styles.title}>No Profile Found</h2>
          <p style={styles.subText}>Please sign in to continue</p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="outline">Register</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    clearFavorites();
    navigate("/login");
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = reader.result as string;
      setPhoto(img);

      const updated = { ...user, photo: img };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  if (showChangePassword) {
    return (
      <div style={styles.page}>
        <ChangePassword onBack={() => setShowChangePassword(false)} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <FontLink />

      {/* Layout */}
      <div style={styles.container}>
        
        {/* LEFT CARD */}
        <aside style={styles.leftCard}>
          <div style={styles.avatarWrap}>
            <Avatar style={styles.avatar}>
              {photo ? (
                <AvatarImage src={photo} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>

            <h2 style={styles.name}>
              {user.firstName} {user.lastName}
            </h2>

            <Badge style={styles.roleBadge}>
              <ShieldCheck size={12} /> {user.role}
            </Badge>
          </div>

          <div style={styles.section}>
            <p style={styles.label}>Account</p>
            <p style={styles.value}>Active</p>
          </div>

          <div style={styles.actions}>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handlePhoto}
            />

            <Button onClick={() => fileInputRef.current?.click()}>
              Change Photo
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </Button>

            <Button variant="secondary" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main style={styles.right}>
          
          <h1 style={styles.heading}>
            Welcome back, <span style={{ color: "#c8a96e" }}>{user.firstName}</span>
          </h1>

          <div style={styles.statsGrid}>
            {[
              { label: "Favorites", value: 24, icon: Heart },
              { label: "Viewed", value: 12, icon: Eye },
              { label: "Listings", value: 3, icon: Home },
            ].map((s) => (
              <div key={s.label} style={styles.statCard}>
                <s.icon size={18} color="#c8a96e" />
                <p style={styles.statValue}>{s.value}</p>
                <p style={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Profile Details</h3>

            <div style={styles.infoGrid}>
              <Info label="First Name" value={user.firstName} />
              <Info label="Last Name" value={user.lastName} />
              <Info label="Email" value={user.email} />
              <Info label="Role" value={user.role} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

/* ───────── small component ───────── */
const Info = ({ label, value }: any) => (
  <div style={styles.infoBox}>
    <p style={styles.infoLabel}>{label}</p>
    <p style={styles.infoValue}>{value}</p>
  </div>
);

/* ───────── styles ───────── */
const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#faf9f7",
    fontFamily: "'DM Sans', sans-serif",
    padding: 30,
  },

  container: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 24,
  },

  leftCard: {
    background: "rgba(255,253,248,0.92)",
    border: "1px solid rgba(200,169,110,0.25)",
    borderRadius: 24,
    padding: 24,
    backdropFilter: "blur(20px)",
  },

  avatarWrap: {
    textAlign: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    margin: "0 auto",
    borderRadius: 24,
    border: "1px solid rgba(200,169,110,0.3)",
  },

  name: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 26,
    marginTop: 12,
    color: "#1a1814",
  },

  roleBadge: {
    marginTop: 10,
    background: "#f5efe2",
    color: "#6b5636",
    borderRadius: 20,
    padding: "4px 10px",
  },

  section: {
    marginTop: 20,
  },

  label: {
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#a08555",
  },

  value: {
    fontSize: 16,
    color: "#1a1814",
    marginTop: 6,
  },

  actions: {
    marginTop: 24,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  right: {
    padding: 10,
  },

  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 34,
    marginBottom: 20,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 24,
  },

  statCard: {
    background: "rgba(255,253,248,0.9)",
    border: "1px solid rgba(200,169,110,0.2)",
    borderRadius: 18,
    padding: 16,
    textAlign: "center",
  },

  statValue: {
    fontSize: 24,
    marginTop: 6,
    fontWeight: 500,
  },

  statLabel: {
    fontSize: 12,
    color: "#a08555",
  },

  infoCard: {
    background: "rgba(255,253,248,0.9)",
    border: "1px solid rgba(200,169,110,0.2)",
    borderRadius: 20,
    padding: 20,
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 14,
    fontFamily: "'Cormorant Garamond', serif",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  infoBox: {
    background: "#fff",
    border: "1px solid rgba(200,169,110,0.15)",
    borderRadius: 14,
    padding: 14,
  },

  infoLabel: {
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#a08555",
  },

  infoValue: {
    marginTop: 6,
    fontSize: 14,
  },

  centerCard: {
    maxWidth: 420,
    margin: "120px auto",
    textAlign: "center",
    padding: 30,
    background: "white",
    borderRadius: 20,
    border: "1px solid rgba(200,169,110,0.2)",
  },

  title: {
    fontSize: 22,
    marginTop: 10,
  },

  subText: {
    color: "#777",
    marginTop: 6,
  },
};

export default Profile;