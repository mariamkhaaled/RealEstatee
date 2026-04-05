import React from 'react';
import { Search, MapPin, Home, DollarSign, ListFilter } from 'lucide-react';

const SearchFilter: React.FC = () => {
  return (
    <div data-cmp="SearchFilter" className="bg-card p-4 md:p-6 rounded-2xl shadow-custom w-full max-w-5xl mx-auto border border-border">
      <div className="flex flex-col md:flex-row gap-4">
        
        <div className="flex-1 relative">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Location</label>
          <div className="relative">
            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input 
              type="text" 
              placeholder="City, Neighborhood, or Zip" 
              className="w-full bg-secondary text-foreground pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 relative">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Property Type</label>
          <div className="relative">
            <Home size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <select className="w-full bg-secondary text-foreground pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="house">House</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Max Price</label>
          <div className="relative">
            <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <select className="w-full bg-secondary text-foreground pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
              <option value="">Any Price</option>
              <option value="500000">$500,000</option>
              <option value="1000000">$1,000,000</option>
              <option value="5000000">$5,000,000</option>
            </select>
          </div>
        </div>

        <div className="flex items-end gap-2 mt-4 md:mt-0">
          <button className="bg-secondary text-foreground p-3 rounded-lg hover:bg-secondary/80 transition-colors border border-border">
            <ListFilter size={24} />
          </button>
          <button className="bg-primary text-primary-foreground flex-1 md:flex-none px-8 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors shadow-custom">
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;