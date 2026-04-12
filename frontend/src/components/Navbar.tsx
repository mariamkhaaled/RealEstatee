import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, User, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const userPhoto = user?.photo || null;
  const initials = user ? `${user.firstName?.charAt(0) || 'U'}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav data-cmp="Navbar" className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
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
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              Home
            </Link>
            <Link to="/properties" className={`text-sm font-medium transition-colors ${isActive('/properties') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              Properties
            </Link>
            <Link to="/favorites" className={`text-sm font-medium transition-colors flex items-center space-x-1 ${isActive('/favorites') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              <Heart size={16} />
              <span>Favorites</span>
            </Link>
          </div>

          {/* Auth & Dashboards (Simulated Role Access) */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3 mr-4 border-r border-border pr-4">
              <Link to="/owner-dashboard" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                <LayoutDashboard size={14} /> <span>Owner</span>
              </Link>
              <Link to="/admin-dashboard" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                <LayoutDashboard size={14} /> <span>Admin</span>
              </Link>
            </div>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className={`flex items-center gap-3 rounded-full border border-border bg-secondary/80 px-3 py-2 text-sm font-medium transition-colors ${isActive('/profile') ? 'border-primary text-primary' : 'text-muted-foreground hover:border-primary hover:text-primary'}`}>
                  <Avatar className="h-8 w-8 rounded-full bg-background">
                    {userPhoto ? (
                      <AvatarImage src={userPhoto} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <AvatarFallback className="text-foreground">{initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden sm:flex">
                  <LogOut className="mr-2" size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <LogIn className="mr-2" size={16} />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    <User className="mr-2" size={16} />
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