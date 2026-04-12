import React, { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Property } from '@/types';

// -------------------- MOCK DATA --------------------
const MOCK_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Luxury Penthouse Downtown",
    description: "Modern penthouse with city view.",
    price: 950000,
    location: "New York, NY",
    type: "Apartment",
    purpose: "Sale",
    beds: 3,
    baths: 2,
    sqft: 1800,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    features: ["Parking", "Gym", "Pool"],
    ownerId: "owner1",
    status: "Approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Cozy Family House",
    description: "Perfect house for families.",
    price: 320000,
    location: "Chicago, IL",
    type: "House",
    purpose: "Sale",
    beds: 4,
    baths: 3,
    sqft: 2400,
    images: ["https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80"],
    features: ["Garden", "Parking"],
    ownerId: "owner2",
    status: "Approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    title: "Beachfront Luxury Villa",
    description: "Sea view villa with private beach.",
    price: 1200000,
    location: "Miami, FL",
    type: "Villa",
    purpose: "Rent",
    beds: 5,
    baths: 4,
    sqft: 4500,
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    features: ["Pool", "Sea View", "Private Beach"],
    ownerId: "owner3",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p4",
    title: "Modern Office Space",
    description: "Office in business district.",
    price: 850000,
    location: "Seattle, WA",
    type: "Office",
    purpose: "Sale",
    beds: 0,
    baths: 2,
    sqft: 3000,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"],
    features: ["Internet", "Parking"],
    ownerId: "owner4",
    status: "Approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p5",
    title: "Small Studio Apartment",
    description: "Affordable studio in city center.",
    price: 1500,
    location: "Denver, CO",
    type: "Apartment",
    purpose: "Rent",
    beds: 1,
    baths: 1,
    sqft: 600,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"],
    features: ["Furnished"],
    ownerId: "owner5",
    status: "Approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p6",
    title: "Luxury Mansion Estate",
    description: "Huge estate with luxury design.",
    price: 2100000,
    location: "Los Angeles, CA",
    type: "House",
    purpose: "Sale",
    beds: 6,
    baths: 5,
    sqft: 6000,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
    features: ["Pool", "Cinema", "Garden", "Gym"],
    ownerId: "owner6",
    status: "Approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p7",
    title: "Downtown Loft Apartment",
    description: "Industrial style loft.",
    price: 450000,
    location: "San Francisco, CA",
    type: "Apartment",
    purpose: "Sale",
    beds: 2,
    baths: 2,
    sqft: 1300,
    images: ["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80"],
    features: ["City View"],
    ownerId: "owner7",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p8",
    title: "Suburban Family Villa",
    description: "Quiet area with big garden.",
    price: 520000,
    location: "Austin, TX",
    type: "Villa",
    purpose: "Rent",
    beds: 4,
    baths: 3,
    sqft: 2800,
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
    features: ["Garden", "Garage"],
    ownerId: "owner8",
    status: "Approved",
    createdAt: new Date().toISOString(),
  },
];

// -------------------- COMPONENT --------------------
const Properties: React.FC = () => {
  const [search, setSearch] = useState('');
  const [purpose, setPurpose] = useState('Any Status');
  const [type, setType] = useState('All Types');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtered, setFiltered] = useState(MOCK_PROPERTIES);

  // -------------------- FILTER LOGIC --------------------
  const applyFilters = () => {
    let result = MOCK_PROPERTIES;

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (purpose !== 'Any Status') {
      result = result.filter((p) =>
        purpose === 'For Sale' ? p.purpose === 'Sale' : p.purpose === 'Rent'
      );
    }

    if (type !== 'All Types') {
      result = result.filter((p) => p.type === type);
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    setFiltered(result);
  };

  // -------------------- UI --------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-card p-6 rounded-xl shadow-custom border border-border sticky top-24">

          <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
            <SlidersHorizontal size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="space-y-6">

            {/* Search */}
            <div>
              <label className="text-sm font-medium block mb-2">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
                <Input
                  placeholder="Search..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="text-sm font-medium block mb-2">Purpose</label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option>Any Status</option>
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-medium block mb-2">Property Type</label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                onChange={(e) => setType(e.target.value)}
              >
                <option>All Types</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>House</option>
                <option>Office</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium block mb-2">Price Range</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <Button className="w-full" onClick={applyFilters}>
              Apply Filters
            </Button>

          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Showing Properties</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </main>

    </div>
  );
};

export default Properties;