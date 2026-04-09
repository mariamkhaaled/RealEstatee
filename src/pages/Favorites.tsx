import React from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';

// Mock favorited property
const FAVORITE_PROPERTY: Property = {
  id: 'fav1',
  title: 'Beachfront Villa',
  description: 'Wake up to the sound of waves.',
  price: 1200000,
  location: 'Miami, FL',
  type: 'Villa',
  purpose: 'Sale',
  beds: 5,
  baths: 4,
  sqft: 4500,
  images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  features: ['Pool'],
  ownerId: 'o1',
  status: 'Approved',
  createdAt: new Date().toISOString()
};

const Favorites: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground">Saved Properties</h1>
        <p className="text-muted-foreground mt-2">Your personal collection of favorite homes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PropertyCard property={FAVORITE_PROPERTY} isFavorite={true} />
        {/* Additional items would be mapped here */}
      </div>
    </div>
  );
};

export default Favorites;