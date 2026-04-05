import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Property } from '@/types';

interface PropertyCardProps {
  property?: Property;
}

const defaultProperty: Property = {
  id: '1',
  title: 'Modern Luxury Apartment',
  price: 450000,
  location: 'Downtown, New York',
  beds: 3,
  baths: 2,
  area: 1200,
  type: 'Apartment',
  purpose: 'Sale',
  image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  isFavorite: false
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property = defaultProperty }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div data-cmp="PropertyCard" className="bg-card rounded-xl overflow-hidden shadow-custom border border-border group hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-custom">
            For {property.purpose}
          </span>
          <span className="bg-card text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-custom">
            {property.type}
          </span>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-custom">
          <Heart 
            size={20} 
            className={property.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground"} 
          />
        </button>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-bold text-xl">{formattedPrice}{property.purpose === 'Rent' ? '/mo' : ''}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <Link to="/property-details" className="block hover:text-primary transition-colors">
          <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{property.title}</h2>
        </Link>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Bed size={18} className="text-primary" />
            <span className="text-sm font-medium">{property.beds} Beds</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Bath size={18} className="text-primary" />
            <span className="text-sm font-medium">{property.baths} Baths</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Square size={18} className="text-primary" />
            <span className="text-sm font-medium">{property.area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;