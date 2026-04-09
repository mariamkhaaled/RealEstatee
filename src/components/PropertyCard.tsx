import React from 'react';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isFavorite = false }) => {
  return (
    <div data-cmp="PropertyCard" className="bg-card rounded-xl overflow-hidden shadow-custom border border-border group transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-sm border-none">
            For {property.purpose}
          </Badge>
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm text-foreground border-none">
            {property.type}
          </Badge>
        </div>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors">
          <Heart size={18} className={isFavorite ? "fill-destructive text-destructive" : ""} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">{property.title}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap ml-3">
            ${property.price.toLocaleString()}
            {property.purpose === 'Rent' && <span className="text-sm text-muted-foreground font-normal">/mo</span>}
          </span>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-border">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Bed size={18} className="mb-1" />
            <span className="text-xs font-medium">{property.beds} Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center text-muted-foreground border-x border-border">
            <Bath size={18} className="mb-1" />
            <span className="text-xs font-medium">{property.baths} Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Square size={18} className="mb-1" />
            <span className="text-xs font-medium">{property.sqft} sqft</span>
          </div>
        </div>

        <Link to="/property-details" className="block w-full text-center py-2.5 mt-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;