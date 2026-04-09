import React from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Property } from '@/types';

// Mocking some data for the catalog
const MOCK_PROPERTIES: Property[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `p${i}`,
  title: ['Luxury Penthouse', 'Suburban House', 'Beachfront Villa', 'Modern Office', 'Cozy Apartment', 'Estate Home'][i],
  description: 'A wonderful property waiting for you.',
  price: [450000, 320000, 1200000, 850000, 250000, 2100000][i],
  location: ['New York, NY', 'Chicago, IL', 'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Los Angeles, CA'][i],
  type: (['Apartment', 'House', 'Villa', 'Office', 'Apartment', 'House'][i]) as any,
  purpose: (['Sale', 'Sale', 'Rent', 'Sale', 'Rent', 'Sale'][i]) as any,
  beds: [3, 4, 5, 0, 2, 6][i],
  baths: [2, 3, 4, 2, 1, 5][i],
  sqft: [1500, 2400, 4500, 3000, 900, 6000][i],
  images: [`https://images.unsplash.com/photo-${[
    '1512917774080-9991f1c4c750', '1583608205776-bfd35f0d9f83', '1600596542815-ffad4c1539a9', 
    '1497366216548-37526070297c', '1522708323590-d24dbb6b0267', '1600585154340-be6161a56a0c'
  ][i]}?w=800&q=80`],
  features: ['Parking'],
  ownerId: 'owner1',
  status: 'Approved',
  createdAt: new Date().toISOString()
}));

const Properties: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-card p-6 rounded-xl shadow-custom border border-border sticky top-24">
          <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
            <SlidersHorizontal size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input placeholder="Search..." className="pl-9" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Purpose</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary">
                <option>Any Status</option>
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Property Type</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary">
                <option>All Types</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>House</option>
                <option>Office</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
              <div className="flex gap-2">
                <Input placeholder="Min" type="number" />
                <Input placeholder="Max" type="number" />
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Showing Properties</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="h-9 px-3 rounded-md border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-primary">
              <option>Newest First</option>
              <option>Price (Low to High)</option>
              <option>Price (High to Low)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROPERTIES.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Properties;