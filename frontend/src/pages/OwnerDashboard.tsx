import React, { useState } from 'react';
import StatCard from '@/components/StatCard';
import { Building, Eye, Heart, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import AddPropertyModal from './AddPropertyPage';
const OwnerDashboard: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [openRequestModal, setOpenRequestModal] = useState(false);

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
            <p className="text-muted-foreground">Manage your properties and track performance.</p>
          </div>

          <Button onClick={() => setOpenAddModal(true)}>
            <Plus className="mr-2" size={18} />
            Add Property
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Active Listings" value="12" icon={Building} trend="2" />
          <StatCard title="Total Views" value="4,821" icon={Eye} trend="12%" />
          <StatCard title="Saved by Users" value="384" icon={Heart} trend="5%" />
        </div>

        <div className="bg-card rounded-xl shadow-custom border border-border overflow-hidden mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">My Listings</h2>
          </div>

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
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-secondary overflow-hidden flex-shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80"
                            className="w-full h-full object-cover"
                            alt="prop"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Modern Seaside Villa</p>
                          <p className="text-xs text-muted-foreground">Miami, FL</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">Sale</td>
                    <td className="px-6 py-4 font-medium text-foreground">$1,250,000</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">1,204</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-custom border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Listing Requests</h2>
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
                      <div>
                        <p className="font-semibold text-foreground">{b.property}</p>
                        <p className="text-xs text-muted-foreground">{b.location}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{b.bookedBy}</p>
                        <p className="text-xs text-muted-foreground">{b.email}</p>
                        <p className="text-xs text-muted-foreground">{b.phone}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground max-w-[260px]">
                      <p className="truncate">{b.message}</p>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">{b.date}</td>

                    <td className="px-6 py-4 font-medium text-foreground">{b.price}</td>

                    <td className="px-6 py-4">
                      <Badge
                        className={
                          b.status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : b.status === 'Accepted'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
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
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
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
        <DialogContent
          className="bg-background fixed top-[50%] left-[50%] z-50 grid w-[95vw] max-w-6xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border p-6 shadow-lg duration-200 overflow-hidden rounded-2xl p-6 sm:p-8"
          showCloseButton
        >
          <AddPropertyModal onClose={() => setOpenAddModal(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={openRequestModal} onOpenChange={setOpenRequestModal}>
        <DialogContent className="w-[60vw] max-w-md max-h-[85vh] overflow-y-auto rounded-2xl p-0">
          {selectedRequest && (
            <div className="bg-background">

              {/* Header */}
              <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="text-xl font-bold text-foreground">
                  Request Details
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review this request before taking action
                </p>
              </div>

              <div className="p-6 space-y-6">

                {/* Listing Card */}
                <div className="rounded-xl border border-border p-4 bg-card shadow-sm">
                  <p className="text-xs text-muted-foreground mb-1">Listing</p>
                  <p className="font-semibold text-foreground text-base">
                    {selectedRequest.property}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.location}
                  </p>
                </div>

                {/* User Info */}
                <div className="rounded-xl border border-border p-4 bg-card shadow-sm">
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Requester Info
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Name</p>
                      <p className="font-medium">{selectedRequest.bookedBy}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Email</p>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Phone</p>
                      <a
                        href={`tel:${selectedRequest.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedRequest.phone}
                      </a>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Date</p>
                      <p className="font-medium">{selectedRequest.date}</p>
                    </div>

                  </div>
                </div>

                {/* Price + Status */}
                <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-card shadow-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Offered Price</p>
                    <p className="text-lg font-bold text-foreground">
                      {selectedRequest.price}
                    </p>
                  </div>

                  <Badge
                    className={
                      selectedRequest.status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : selectedRequest.status === 'Accepted'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Message
                  </p>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground leading-relaxed">
                    {selectedRequest.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">

                  <Button
                    variant="outline"
                    onClick={() => setOpenRequestModal(false)}
                  >
                    Close
                  </Button>

                  <div className="flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-5">
                      Accept
                    </Button>

                    <Button variant="destructive" className="px-5">
                      Reject
                    </Button>
                  </div>

                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OwnerDashboard;