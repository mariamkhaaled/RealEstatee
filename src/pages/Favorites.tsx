import React from 'react';
import { Heart } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';

const mockFavoriteProperties: Property[] = [
  { id: '2', title: 'Spacious Family Villa', price: 1250000, location: 'Beverly Hills, California', beds: 5, baths: 4, area: 3500, type: 'Villa', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', isFavorite: true },
  { id: '6', title: 'Beachfront Luxury Villa', price: 3200000, location: 'Miami, Florida', beds: 6, baths: 5, area: 4500, type: 'Villa', purpose: 'Sale', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', isFavorite: true },
];

const Favorites: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-border">
          <div className="bg-destructive/10 p-3 rounded-xl">
            <Heart size={28} className="text-destructive fill-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Favorites</h1>
            <p className="text-muted-foreground">Properties you've saved to look at later.</p>
          </div>
        </div>

        {mockFavoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFavoriteProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-custom">
            <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">Start browsing and save properties you love.</p>
            <a href="/listings" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-custom">
              Explore Properties
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default Favorites;