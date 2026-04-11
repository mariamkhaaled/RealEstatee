import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, User, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;