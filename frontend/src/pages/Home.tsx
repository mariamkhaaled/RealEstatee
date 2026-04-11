import React from 'react';
import { Search, Home as HomeIcon, Building, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Seaside Villa',
    description: 'Beautiful villa with ocean view.',
    price: 1250000,
    location: 'Miami, FL',
    type: 'Villa' as const,
    purpose: 'Sale' as const,
    beds: 4,
    baths: 3,
    sqft: 3200,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    features: ['Pool', 'Garage'],
    ownerId: 'o1',
    status: 'Approved' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    description: 'Heart of the city living.',
    price: 4500,
    location: 'New York, NY',
    type: 'Apartment' as const,
    purpose: 'Rent' as const,
    beds: 2,
    baths: 2,
    sqft: 1100,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    features: ['Gym', 'Doorman'],
    ownerId: 'o2',
    status: 'Approved' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Spacious Family Home',
    description: 'Perfect for a growing family.',
    price: 750000,
    location: 'Austin, TX',
    type: 'House' as const,
    purpose: 'Sale' as const,
    beds: 5,
    baths: 4,
    sqft: 4100,
    images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80'],
    features: ['Yard', 'Fireplace'],
    ownerId: 'o1',
    status: 'Approved' as const,
    createdAt: new Date().toISOString()
  }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex items-center justify-center min-h-[600px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Find Your Dream Home Today
          </h1>
          <p className="text-xl text-gray-200 mb-10 drop-shadow-md">
            Discover the best properties for sale, rent, and installments.
          </p>

          {/* Search Box */}
          <div className="bg-card p-4 rounded-2xl shadow-custom max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Location, City, or Zip" className="pl-10 h-12 bg-secondary border-none" />
            </div>
            <select className="h-12 px-4 rounded-md bg-secondary text-foreground border-none focus:ring-2 focus:ring-primary outline-none">
              <option>Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>House</option>
              <option>Office</option>
            </select>
            <Button size="lg" className="h-12 px-8">
              <Search className="mr-2" size={18} />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: HomeIcon, label: 'Houses', count: '120+' },
            { icon: Building, label: 'Apartments', count: '250+' },
            { icon: HomeIcon, label: 'Villas', count: '85+' },
            { icon: Briefcase, label: 'Offices', count: '40+' },
          ].map((cat, i) => (
            <div key={i} className="bg-card p-6 rounded-xl shadow-custom border border-border text-center hover:border-primary transition-colors cursor-pointer group">
              <div className="w-14 h-14 mx-auto bg-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <cat.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{cat.label}</h3>
              <p className="text-muted-foreground text-sm mt-1">{cat.count} Properties</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Handpicked selections just for you</p>
          </div>
          <Link to="/properties">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROPERTIES.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;