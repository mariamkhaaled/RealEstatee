import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, User, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null;

  const userPhoto = user?.photo || null;

  const initials = user
    ? `${user.firstName?.charAt(0) || 'U'}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="text-primary-foreground" size={20} />
            </div>
            <span className="text-xl font-bold text-foreground">LuxeEstates</span>
          </Link>

          {/* Main Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              Home
            </Link>

            <Link to="/properties" className={`text-sm font-medium ${isActive('/properties') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              Properties
            </Link>

            <Link to="/favorites" className={`text-sm font-medium flex items-center gap-1 ${isActive('/favorites') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              <Heart size={16} />
              Favorites
            </Link>

            {/* Dashboard Links - Conditional Based on Role */}
            {isLoggedIn && user?.role === 'owner' && (
              <Link to="/owner-dashboard" className={`text-sm font-medium flex items-center gap-1 ${isActive('/owner-dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                <LayoutDashboard size={16} />
                My Dashboard
              </Link>
            )}

            {isLoggedIn && user?.role === 'admin' && (
              <Link to="/admin-dashboard" className={`text-sm font-medium flex items-center gap-1 ${isActive('/admin-dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                <LayoutDashboard size={16} />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">

            {/* 👇 Role INFO ONLY (no navigation links) */}
            {isLoggedIn && (
              <div className="hidden lg:flex flex-col items-end mr-3 pr-3 border-r border-border">
                <span className="text-xs text-muted-foreground">Logged in as</span>
                <span className="text-sm font-semibold text-foreground capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
            )}

            {isLoggedIn ? (
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 rounded-full border border-border bg-secondary/80 px-3 py-2 text-sm font-medium ${
                    isActive('/profile')
                      ? 'border-primary text-primary'
                      : 'text-muted-foreground hover:border-primary hover:text-primary'
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
                <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden sm:flex">
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