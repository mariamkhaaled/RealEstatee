import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Heart,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUnreadCounts } from "@/api/messages";
import { connectSocket } from "@/lib/socket";
import { getInquiries, getMyInquiries } from "@/api/inquiries";
import { useFavorites } from "@/context/FavoritesContext";

type InquiryRef = { inquiry_id: number };

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadDashboard, setUnreadDashboard] = useState(0);
  const [unreadMyInquiries, setUnreadMyInquiries] = useState(0);
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const syncUser = () => {
      setUser(readStoredUser());
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("user-updated", syncUser as EventListener);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-updated", syncUser as EventListener);
    };
  }, []);

  const userPhoto = user?.photo || null;
  const normalizedRole = String(user?.role || "").toLowerCase();

  const initials = user
    ? `${user.firstName?.charAt(0) || "U"}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "U";

  const { clearFavorites } = useFavorites();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const currentUserId = Number(user?.id || user?.user_id || 0);
  const isOwner = normalizedRole === "owner";
  const isCustomer = normalizedRole === "customer" || normalizedRole === "user";
  const isAdmin = normalizedRole === "admin";
  const showMyInquiriesUnread = Boolean(isLoggedIn && !isAdmin);
  const showDashboardUnread = Boolean(isLoggedIn && isOwner);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-updated"));
    clearFavorites();
    navigate("/login");
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const loadUnread = async () => {
      if (!isLoggedIn || isAdmin) {
        setUnreadDashboard(0);
        setUnreadMyInquiries(0);
        return;
      }

      try {
        const [countsResponse, ownerInquiriesResponse, myInquiriesResponse] =
          await Promise.all([
            getUnreadCounts(),
            getInquiries(),
            getMyInquiries(),
          ]);

        const unreadMap = new Map<number, number>();
        (countsResponse.data || []).forEach((row) => {
          unreadMap.set(Number(row.inquiry_id), Number(row.unread_count || 0));
        });

        const ownerInquiryIds = new Set<number>(
          ((ownerInquiriesResponse.data || []) as InquiryRef[]).map((item) =>
            Number(item.inquiry_id),
          ),
        );

        const myInquiryIds = new Set<number>(
          ((myInquiriesResponse.data || []) as InquiryRef[]).map((item) =>
            Number(item.inquiry_id),
          ),
        );

        let dashboardCount = 0;
        let myInquiriesCount = 0;

        unreadMap.forEach((count, inquiryId) => {
          if (isOwner && ownerInquiryIds.has(inquiryId)) {
            dashboardCount += count;
          }

          if ((isOwner || isCustomer) && myInquiryIds.has(inquiryId)) {
            myInquiriesCount += count;
          }
        });

        setUnreadDashboard(dashboardCount);
        setUnreadMyInquiries(myInquiriesCount);
      } catch {
        // keep navbar stable if unread endpoint fails
      }
    };

    const onUnreadChanged = () => {
      loadUnread();
    };

    loadUnread();
    window.addEventListener("unread-count-changed", onUnreadChanged);
    intervalId = setInterval(loadUnread, 8000);

    return () => {
      window.removeEventListener("unread-count-changed", onUnreadChanged);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn, isAdmin, isCustomer, isOwner, location.pathname, user?.role]);

  useEffect(() => {
    if (!isLoggedIn || isAdmin) {
      return;
    }

    const socket = connectSocket();

    const onNewMessage = (message: { receiver_id?: number }) => {
      if (Number(message?.receiver_id) === currentUserId) {
        window.dispatchEvent(new Event("unread-count-changed"));
      }
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [isLoggedIn, isAdmin, currentUserId]);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="text-primary-foreground" size={20} />
            </div>
            <span className="text-xl font-bold text-foreground">
              LuxeEstates
            </span>
          </Link>

          {/* Main Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              Home
            </Link>

            <Link
              to="/properties"
              className={`text-sm font-medium ${isActive("/properties") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              Properties
            </Link>

            <Link
              to="/favorites"
              className={`text-sm font-medium flex items-center gap-1 ${isActive("/favorites") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              <Heart size={16} />
              Favorites
            </Link>

            {/* Dashboard Links - Conditional Based on Role */}
            {showDashboardUnread && (
              <Link
                to="/owner-dashboard"
                className={`text-sm font-medium flex items-center gap-1 ${isActive("/owner-dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <LayoutDashboard size={16} />
                My Dashboard
                {unreadDashboard > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
                    {unreadDashboard}
                  </span>
                ) : null}
              </Link>
            )}

            {isLoggedIn && user?.role === "admin" && (
              <Link
                to="/admin-dashboard"
                className={`text-sm font-medium flex items-center gap-1 ${isActive("/admin-dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </Link>
            )}

            {isLoggedIn && user?.role !== "admin" && (
              <Link
                to="/my-inquiries"
                className={`text-sm font-medium flex items-center gap-1 ${isActive("/my-inquiries") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <MessageSquare size={16} />
                My Inquiries
                {showMyInquiriesUnread && unreadMyInquiries > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
                    {unreadMyInquiries}
                  </span>
                ) : null}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* 👇 Role INFO ONLY (no navigation links) */}
            {isLoggedIn && (
              <div className="hidden lg:flex flex-col items-end mr-3 pr-3 border-r border-border">
                <span className="text-xs text-muted-foreground">
                  Logged in as
                </span>
                <span className="text-sm font-semibold text-foreground capitalize">
                  {normalizedRole || "customer"}
                </span>
              </div>
            )}

            {isLoggedIn ? (
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 rounded-full border border-border bg-secondary/80 px-3 py-2 text-sm font-medium ${
                    isActive("/profile")
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {userPhoto ? (
                      <AvatarImage src={userPhoto} />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </Avatar>

                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout */}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn size={16} className="mr-2" />
                    Sign In
                  </Button>
                </Link>

                <Link to="/register">
                  <Button size="sm">
                    <User size={16} className="mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
