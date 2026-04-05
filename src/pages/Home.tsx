import React from 'react';
import SearchFilter from '@/components/SearchFilter';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import { ArrowRight, Building, Key, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockProperties: Property[] = [
  {
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
  },
  {
    id: '2',
    title: 'Spacious Family Villa',
    price: 1250000,
    location: 'Beverly Hills, California',
    beds: 5,
    baths: 4,
    area: 3500,
    type: 'Villa',
    purpose: 'Sale',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Minimalist Office Space',
    price: 3500,
    location: 'Tech Park, San Francisco',
    beds: 0,
    baths: 2,
    area: 2000,
    type: 'Office',
    purpose: 'Rent',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isFavorite: false
  },
  {
    id: '4',
    title: 'Cozy Suburban House',
    price: 550000,
    location: 'Maplewood, New Jersey',
    beds: 4,
    baths: 3,
    area: 2200,
    type: 'House',
    purpose: 'Sale',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    isFavorite: false
  },
  {
    id: '5',
    title: 'High-Rise City View Condo',
    price: 4200,
    location: 'Chicago, Illinois',
    beds: 2,
    baths: 2,
    area: 1100,
    type: 'Apartment',
    purpose: 'Rent',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
    isFavorite: false
  },
  {
    id: '6',
    title: 'Beachfront Luxury Villa',
    price: 3200000,
    location: 'Miami, Florida',
    beds: 6,
    baths: 5,
    area: 4500,
    type: 'Villa',
    purpose: 'Sale',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    isFavorite: true
  }
];

const Home: React.FC = () => {
  console.log('Rendering Home Page');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            Find Your Perfect <br className="hidden md:block"/> 
            <span className="text-primary">Dream Property</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover the best properties for sale, rent, and installment in the most desirable locations. Your journey home starts here.
          </p>
          
          <div className="-mt-4 md:mt-0 transform translate-y-1/4 md:translate-y-1/2">
            <SearchFilter />
          </div>
        </div>
      </section>

      {/* spacer for overlapping search bar */}
      <div className="h-24 md:h-16"></div>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose EstateAura?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We provide a seamless and secure experience for both property owners and buyers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-custom border border-border text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-accent w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <Building className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Wide Range of Properties</h3>
              <p className="text-muted-foreground">Explore thousands of apartments, villas, and offices updated daily.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-custom border border-border text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-accent w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Secure Transactions</h3>
              <p className="text-muted-foreground">Your safety is our priority. We verify all listings and owners thoroughly.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-custom border border-border text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-accent w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <Key className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Easy Process</h3>
              <p className="text-muted-foreground">From searching to signing, we make the entire process smooth and hassle-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked properties based on popularity and value.</p>
            </div>
            <Link to="/listings" className="hidden md:flex items-center space-x-2 text-primary font-medium hover:text-primary/80 transition-colors">
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/listings" className="inline-flex items-center space-x-2 text-primary font-medium border border-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors">
              <span>View All Properties</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;