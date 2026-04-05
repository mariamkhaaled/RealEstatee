import React from 'react';
import { Plus, Home, Eye, MessageSquare, TrendingUp, Settings, LogOut, Search } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';

const mockOwnerProperties: Property[] = [
  { id: '1', title: 'Modern Luxury Apartment', price: 450000, location: 'Downtown, New York', beds: 3, baths: 2, area: 1200, type: 'Apartment', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { id: '5', title: 'High-Rise City View Condo', price: 4200, location: 'Chicago, Illinois', beds: 2, baths: 2, area: 1100, type: 'Apartment', purpose: 'Rent', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80' },
];

const OwnerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, Michael</h1>
              <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
            </div>
            <button className="bg-primary text-primary-foreground flex items-center space-x-2 px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-custom">
              <Plus size={20} />
              <span>Add New Property</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-2xl shadow-custom border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                MS
              </div>
              <div>
                <p className="font-bold text-foreground">Michael Scott</p>
                <p className="text-xs text-muted-foreground">Owner Account</p>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-colors">
                <Home size={20} />
                <span>My Properties</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                <MessageSquare size={20} />
                <span>Inquiries</span>
                <span className="ml-auto bg-destructive text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                <TrendingUp size={20} />
                <span>Analytics</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                <Settings size={20} />
                <span>Settings</span>
              </a>
            </nav>
            <div className="p-4 border-t border-border">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 font-medium transition-colors">
                <LogOut size={20} />
                <span>Log Out</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Dashboard */}
        <div className="flex-1 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-6 rounded-2xl shadow-custom border border-border">
              <div className="flex items-center space-x-3 mb-2 text-muted-foreground">
                <Home size={20} />
                <h3 className="font-medium">Total Listings</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">12</p>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-custom border border-border">
              <div className="flex items-center space-x-3 mb-2 text-muted-foreground">
                <Eye size={20} />
                <h3 className="font-medium">Total Views</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">8.4k</p>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-custom border border-border">
              <div className="flex items-center space-x-3 mb-2 text-muted-foreground">
                <MessageSquare size={20} />
                <h3 className="font-medium">New Inquiries</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">24</p>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-custom border border-border">
              <div className="flex items-center space-x-3 mb-2 text-muted-foreground">
                <TrendingUp size={20} />
                <h3 className="font-medium">Conversion</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">3.2%</p>
            </div>
          </div>

          {/* Properties Management Area */}
          <div className="bg-card rounded-2xl shadow-custom border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">Manage Properties</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search listings..." 
                  className="pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                />
              </div>
            </div>
            
            <div className="p-6 bg-background/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockOwnerProperties.map(property => (
                  <div key={property.id} className="relative group">
                    <PropertyCard property={property} />
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-card text-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-custom hover:bg-secondary transition-colors border border-border">
                        Edit
                      </button>
                      <button className="bg-destructive text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-custom hover:bg-destructive/90 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;