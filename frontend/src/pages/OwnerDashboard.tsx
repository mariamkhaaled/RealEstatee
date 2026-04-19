import React, { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { Building, Eye, Heart, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddPropertyModal from './AddPropertyPage';
import { Navigate } from 'react-router-dom';

type PropertyType = {
  property_id: number;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  listing_id: number;
  purpose: string;
  price: string | number;
  status: string;
  views: number;
  city: string;
  address: string;
  images: string[];
  features: string[];
};

const OwnerDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user || user.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [openRequestModal, setOpenRequestModal] = useState(false);

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ownerId = user?.user_id || user?.id;


  const fetchOwnerProperties = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`http://localhost:5000/api/properties/owner/${ownerId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch properties');
      }

      setProperties(data.data.properties || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    if (!ownerId) return;
    fetchOwnerProperties();
  }, [ownerId]);

   

  const activeListingsCount = properties.length;
  const totalViews = properties.reduce((sum, p) => sum + Number(p.views || 0), 0);

  const requests = [
    {
      id: 1,
      property: 'Modern Seaside Villa',
      location: 'Miami, FL',
      price: '$1,250,000',
      bookedBy: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 987-6543',
      message: 'I am interested in this listing and would like to schedule a viewing.',
      status: 'Pending',
      date: '2026-04-10',
    },
    {
      id: 2,
      property: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      price: '$980,000',
      bookedBy: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 987-6543',
      message: 'Please contact me. I want to discuss payment details.',
      status: 'Accepted',
      date: '2026-04-09',
    },
    {
      id: 3,
      property: 'Mountain View House',
      location: 'Denver, CO',
      price: '$720,000',
      bookedBy: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+1 (555) 987-6543',
      message: 'Is this property still available for immediate purchase?',
      status: 'Rejected',
      date: '2026-04-08',
    },
  ];



  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your properties and track performance.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Logged in as: <span className="font-semibold">Owner</span>
            </p>
          </div>

          <Button onClick={() => setOpenAddModal(true)}>
            <Plus className="mr-2" size={18} />
            Add Property
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Active Listings" value={String(activeListingsCount)} icon={Building} trend="0" />
          <StatCard title="Total Views" value={String(totalViews)} icon={Eye} trend="0%" />
          <StatCard title="Saved by Users" value="0" icon={Heart} trend="0%" />
        </div>

        <div className="bg-card rounded-xl shadow-custom border border-border overflow-hidden mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">My Listings</h2>
          </div>

          {loading ? (
            <div className="p-6 text-muted-foreground">Loading properties...</div>
          ) : error ? (
            <div className="p-6 text-red-500">{error}</div>
          ) : properties.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-foreground">No listings yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                You haven’t added any properties yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {properties.map((property) => (
                    <tr key={property.property_id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-secondary overflow-hidden flex-shrink-0">
                            <img
                              src={
                                property.images?.[0]
                                  ? property.images[0].startsWith("http")
                                    ? property.images[0]
                                    : `http://localhost:5000${property.images[0]}`
                                  : "https://via.placeholder.com/100x100?text=No+Image"
                              }
                              className="w-full h-full object-cover"
                              alt={property.title}
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-foreground">{property.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {property.city}, {property.address}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-foreground">{property.purpose}</td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        ${Number(property.price).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {property.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">{property.views}</td>

                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl shadow-custom border border-border overflow-hidden">

          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              Listing Requests
            </h2>
            <p className="text-sm text-muted-foreground">
              Review incoming requests for your active listings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">

              <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Listing</th>
                  <th className="px-6 py-4">Requested By</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {requests.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/50 transition-colors">

                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{b.property}</p>
                      <p className="text-xs text-muted-foreground">{b.location}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">{b.bookedBy}</p>
                      <p className="text-xs text-muted-foreground">{b.email}</p>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground max-w-[260px] truncate">
                      {b.message}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">{b.date}</td>
                    <td className="px-6 py-4 font-medium">{b.price}</td>

                    <td className="px-6 py-4">
                      <Badge
                        className={
                          b.status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : b.status === 'Accepted'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(b);
                            setOpenRequestModal(true);
                          }}
                        >
                          View
                        </Button>

                        <Button size="sm" className="bg-green-600 text-white">
                          Accept
                        </Button>

                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>


      </div>

      <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
        <DialogContent className="bg-background fixed top-[50%] left-[50%] z-50 w-[95vw] max-w-6xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%]">
          <AddPropertyModal
            onClose={() => setOpenAddModal(false)}
            onSave={() => fetchOwnerProperties()}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OwnerDashboard;