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
  Building,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUnreadCounts } from "@/api/messages";
import { connectSocket } from "@/lib/socket";
import { getInquiries, getMyInquiries } from "@/api/inquiries";
import { useFavorites } from "@/context/FavoritesContext";
import { useUser } from "@/context/UserContext";

type InquiryRef = { inquiry_id: number };

const getPhotoUrl = (photoPath?: string | null) => {
  if (!photoPath) return null;
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  return `http://localhost:5000${photoPath}`;
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadDashboard, setUnreadDashboard] = useState(0);
  const [unreadMyInquiries, setUnreadMyInquiries] = useState(0);
  const { user, setUser } = useUser();

  const userPhoto = getPhotoUrl(user?.photo || null);
  const normalizedRole = String(user?.role || "").toLowerCase();

  const initials = user
    ? `${user.firstName?.charAt(0) || "U"}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "U";

  const { clearFavorites } = useFavorites();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const currentUserId = Number(user?.id || 0);
  const isOwner = normalizedRole === "owner";
  const isCustomer = normalizedRole === "customer" || normalizedRole === "user";
  const isAdmin = normalizedRole === "admin";
  const showMyInquiriesUnread = Boolean(isLoggedIn && !isAdmin);
  const showDashboardUnread = Boolean(isLoggedIn && isOwner);

  const isActive = (path: string) => location.pathname === path;

  const totalUnread = unreadDashboard + unreadMyInquiries;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
    <>
      {/* Luxury Navbar Styles */}
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');

      .lux-navbar {
        font-family: 'DM Sans', sans-serif;
        backdrop-filter: blur(18px);
        background: rgba(250,249,247,0.82);
        border-bottom: 1px solid rgba(200,169,110,0.18);
      }

      .lux-logo {
        font-family: 'Cormorant Garamond', serif;
      }

      .lux-link {
        position: relative;
        transition: all 0.3s ease;
      }

      .lux-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 0%;
        height: 1px;
        background: #c8a96e;
        transition: width 0.35s ease;
      }

      .lux-link:hover::after,
      .lux-link.active::after {
        width: 100%;
      }

      .lux-link:hover {
        color: #c8a96e;
      }

      .lux-btn-gold {
        background: linear-gradient(
          135deg,
          #c8a96e 0%,
          #e8d4a8 50%,
          #c8a96e 100%
        );
        color: #1a1814;
        transition: all 0.35s ease;
      }

      .lux-btn-gold:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px rgba(200,169,110,0.25);
      }

      .lux-profile {
        background: rgba(255,255,255,0.65);
        border: 1px solid rgba(200,169,110,0.16);
        transition: all 0.35s ease;
      }

      .lux-profile:hover {
        border-color: #c8a96e;
        transform: translateY(-1px);
      }

      .lux-badge {
        background: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
        animation: pulse-badge 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse-badge {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
        }
        50% {
          transform: scale(1.15);
          box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.15);
        }
      }

      .notification-bell {
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .notification-bell:hover {
        transform: scale(1.1);
      }

      .notification-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #dc2626;
        color: white;
        border-radius: 9999px;
        min-width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 900;
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);
        animation: pulse-bell 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        border: 2px solid white;
      }

      @keyframes pulse-bell {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);
        }
        50% {
          transform: scale(1.2);
          box-shadow: 0 0 0 8px rgba(220, 38, 38, 0.15);
        }
      }

      .lux-role {
        border-right: 1px solid rgba(200,169,110,0.15);
      }
    `}</style>

      <nav className="lux-navbar sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#c8a96e,#e8d4a8,#c8a96e)",
                }}
              >
                <Home className="text-[#1a1814]" size={20} />
              </div>

              <div className="flex flex-col leading-none">
                <span className="lux-logo text-[1.65rem] text-[#1a1814] font-light">
                  LuxeEstates
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#a09880]">
                  Premium Realty
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center gap-9">
              <Link
                to="/"
                className={`lux-link text-sm font-medium flex items-center gap-2 ${
                  isActive("/") ? "active text-[#c8a96e]" : "text-[#7a7060]"
                }`}
              >
                <Home size={15} />
                Home
              </Link>

              <Link
                to="/properties"
                className={`lux-link text-sm font-medium flex items-center gap-2 ${
                  isActive("/properties")
                    ? "active text-[#c8a96e]"
                    : "text-[#7a7060]"
                }`}
              >
                <Building size={15} />
                Properties
              </Link>

              <Link
                to="/favorites"
                className={`lux-link text-sm font-medium flex items-center gap-2 ${
                  isActive("/favorites")
                    ? "active text-[#c8a96e]"
                    : "text-[#7a7060]"
                }`}
              >
                <Heart size={15} />
                Favorites
              </Link>

              {showDashboardUnread && (
                <Link
                  to="/owner-dashboard"
                  className={`lux-link text-sm font-medium flex items-center gap-2 ${
                    isActive("/owner-dashboard")
                      ? "active text-[#c8a96e]"
                      : "text-[#7a7060]"
                  }`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                  {unreadDashboard > 0 && (
                    <span className="lux-badge inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[12px] font-bold text-white ml-1">
                      {unreadDashboard}
                    </span>
                  )}
                </Link>
              )}

              {isLoggedIn && user?.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className={`lux-link text-sm font-medium flex items-center gap-2 ${
                    isActive("/admin-dashboard")
                      ? "active text-[#c8a96e]"
                      : "text-[#7a7060]"
                  }`}
                >
                  <LayoutDashboard size={15} />
                  Admin
                </Link>
              )}

              {isLoggedIn && user?.role !== "admin" && (
                <Link
                  to="/my-inquiries"
                  className={`lux-link text-sm font-medium flex items-center gap-2 ${
                    isActive("/my-inquiries")
                      ? "active text-[#c8a96e]"
                      : "text-[#7a7060]"
                  }`}
                >
                  <MessageSquare size={15} />
                  Inquiries
                  {showMyInquiriesUnread && unreadMyInquiries > 0 && (
                    <span className="lux-badge inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[12px] font-bold text-white ml-1">
                      {unreadMyInquiries}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              {isLoggedIn && (unreadDashboard > 0 || unreadMyInquiries > 0) && (
                <Link
                  to={isOwner ? "/owner-dashboard" : "/my-inquiries"}
                  className="notification-bell"
                >
                  <Bell size={20} className="text-[#7a7060]" />
                  {unreadDashboard + unreadMyInquiries > 0 && (
                    <span className="notification-badge">
                      {unreadDashboard + unreadMyInquiries}
                    </span>
                  )}
                </Link>
              )}

              {/* Role */}
              {isLoggedIn && (
                <div className="lux-role hidden xl:flex flex-col items-end pr-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#a09880]">
                    Logged in as
                  </span>

                  <span className="text-sm font-medium capitalize text-[#1a1814]">
                    {normalizedRole || "customer"}
                  </span>
                </div>
              )}

              {isLoggedIn ? (
                <>
                  {/* Profile */}
                  <Link
                    to="/profile"
                    className={`lux-profile relative flex items-center gap-3 rounded-full px-3 py-2 ${
                      isActive("/profile") ? "border-[#c8a96e]" : ""
                    }`}
                  >
                    <Avatar className="h-9 w-9 border border-[#e8e0d4]">
                      {userPhoto ? (
                        <AvatarImage src={userPhoto} />
                      ) : (
                        <AvatarFallback className="bg-[#f5f2ed] text-[#1a1814]">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {totalUnread > 0 && (
                      <span className="notification-badge" aria-hidden>
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}

                    <span className="hidden sm:inline text-sm font-medium text-[#1a1814]">
                      Profile
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 rounded-full border border-[#e8e0d4] px-5 py-2.5 text-sm text-[#7a7060] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="rounded-full border border-[#e8e0d4] px-5 py-2.5 text-sm text-[#7a7060] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all flex items-center gap-2">
                      <LogIn size={15} />
                      Sign In
                    </button>
                  </Link>

                  <Link to="/register">
                    <button className="lux-btn-gold rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2">
                      <User size={15} />
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
