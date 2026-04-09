import React from 'react';
import StatCard from '@/components/StatCard';
import { Building, Eye, Heart, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OwnerDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties and track performance.</p>
        </div>
        <Button>
          <Plus className="mr-2" size={18} /> Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Listings" value="12" icon={Building} trend="2" />
        <StatCard title="Total Views" value="4,821" icon={Eye} trend="12%" />
        <StatCard title="Saved by Users" value="384" icon={Heart} trend="5%" />
      </div>

      <div className="bg-card rounded-xl shadow-custom border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">My Properties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
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
                        <img src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80`} className="w-full h-full object-cover" alt="prop" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Modern Seaside Villa</p>
                        <p className="text-xs text-muted-foreground">Miami, FL</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">$1,250,000</td>
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
    </div>
  );
};

export default OwnerDashboard;