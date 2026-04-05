import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Building, User, LogIn, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  console.log('Rendering Navbar, current path:', location.pathname);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header data-cmp="Navbar" className="bg-card shadow-custom sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Home className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold text-primary">EstateAura</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className={`font-medium transition-colors ${isActive('/listings') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Properties
            </Link>
            <Link 
              to="/favorites" 
              className={`flex items-center space-x-1 font-medium transition-colors ${isActive('/favorites') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Heart size={18} />
              <span>Favorites</span>
            </Link>
            <Link 
              to="/owner-dashboard" 
              className={`flex items-center space-x-1 font-medium transition-colors ${isActive('/owner-dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Building size={18} />
              <span>Owner Dashboard</span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="flex items-center space-x-1 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <LogIn size={18} />
              <span>Log in</span>
            </Link>
            <Link 
              to="/register" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-custom"
            >
              Sign up
            </Link>
          </div>

          <button className="md:hidden text-foreground p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;