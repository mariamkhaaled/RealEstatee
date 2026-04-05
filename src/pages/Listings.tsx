import React from 'react';
import SearchFilter from '@/components/SearchFilter';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import { SlidersHorizontal } from 'lucide-react';

const mockProperties: Property[] = [
  { id: '1', title: 'Modern Luxury Apartment', price: 450000, location: 'Downtown, New York', beds: 3, baths: 2, area: 1200, type: 'Apartment', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { id: '2', title: 'Spacious Family Villa', price: 1250000, location: 'Beverly Hills, California', beds: 5, baths: 4, area: 3500, type: 'Villa', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', isFavorite: true },
  { id: '3', title: 'Minimalist Office Space', price: 3500, location: 'Tech Park, San Francisco', beds: 0, baths: 2, area: 2000, type: 'Office', purpose: 'Rent', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: '4', title: 'Cozy Suburban House', price: 550000, location: 'Maplewood, New Jersey', beds: 4, baths: 3, area: 2200, type: 'House', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
  { id: '5', title: 'High-Rise City View Condo', price: 4200, location: 'Chicago, Illinois', beds: 2, baths: 2, area: 1100, type: 'Apartment', purpose: 'Rent', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80' },
  { id: '6', title: 'Beachfront Luxury Villa', price: 3200000, location: 'Miami, Florida', beds: 6, baths: 5, area: 4500, type: 'Villa', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', isFavorite: true },
  { id: '7', title: 'Downtown Studio', price: 280000, location: 'Seattle, Washington', beds: 1, baths: 1, area: 650, type: 'Apartment', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80' },
  { id: '8', title: 'Lakehouse Retreat', price: 850000, location: 'Lake Tahoe, Nevada', beds: 3, baths: 2, area: 1800, type: 'House', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80' },
];

const Listings: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Find Properties</h1>
        
        <div className="mb-10 relative z-20">
          <SearchFilter />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl p-6 shadow-custom border border-border sticky top-24">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
                <SlidersHorizontal size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wider">Purpose</h3>
                  <div className="space-y-2">
                    {['Sale', 'Rent', 'Installment'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wider">Property Type</h3>
                  <div className="space-y-2">
                    {['Apartment', 'Villa', 'House', 'Office'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wider">Bedrooms</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Any', '1', '2', '3', '4+'].map((num) => (
                      <button key={num} className="px-3 py-1 text-sm border border-border rounded-md hover:border-primary hover:text-primary transition-colors focus:bg-primary focus:text-white">
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary/10 text-primary font-bold py-2 rounded-lg hover:bg-primary/20 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Listing Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground font-medium"><span className="text-foreground font-bold">{mockProperties.length}</span> Properties Found</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Newest First</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            {/* Pagination Mock */}
            <div className="flex justify-center mt-12 space-x-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">1</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground shadow-custom">2</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-muted-foreground">...</span>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">8</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;