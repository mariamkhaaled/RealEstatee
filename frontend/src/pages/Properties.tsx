import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Property } from '@/types';

const Properties = () => {
  const [search, setSearch] = useState('');
  const [purpose, setPurpose] = useState('Any Status');
  const [type, setType] = useState('All Types');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/properties');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch properties');
        }

        const mappedProperties: Property[] = (data.data?.properties || []).map((prop: any) => ({
          id: String(prop.property_id),
          title: prop.title,
          description: prop.description,
          price: Number(prop.price),
          location: `${prop.city}${prop.address ? `, ${prop.address}` : ''}`,
          type: prop.property_type,
          purpose: prop.purpose,
          beds: prop.bedrooms,
          baths: prop.bathrooms,
          sqft: prop.area,
          images: (prop.images || []).map((img: string) =>
            img.startsWith('http') ? img : `http://localhost:5000${img}`
          ),
          features: prop.features || [],
          ownerId: String(prop.owner_id || ''),
          status: prop.status,
          createdAt: new Date().toISOString(),
        }));

        setAllProperties(mappedProperties);
        setFiltered(mappedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const applyFilters = () => {
    let result = allProperties;

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-muted-foreground">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-card p-6 rounded-xl shadow-custom border border-border sticky top-24">

          <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
            <SlidersHorizontal size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="space-y-6">
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