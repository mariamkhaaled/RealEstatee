import React from 'react';
import StatCard from '@/components/StatCard';
import { Users, Building, AlertCircle, TrendingUp, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">System statistics and approval queue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value="1,245" icon={Users} trend="120" />
        <StatCard title="Total Properties" value="842" icon={Building} trend="45" />
        <StatCard title="Pending Approvals" value="18" icon={AlertCircle} isPositive={false} trend="3" />
        <StatCard title="Monthly Revenue" value="$42K" icon={TrendingUp} trend="12%" />
      </div>

      <div className="bg-card rounded-xl shadow-custom border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">Pending Property Approvals</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-secondary overflow-hidden flex-shrink-0">
                        <img src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&q=80`} className="w-full h-full object-cover" alt="prop" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Downtown Luxury Apartment</p>
                        <p className="text-xs text-muted-foreground">New York, NY</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">Sarah Jenkins</td>
                  <td className="px-6 py-4 text-muted-foreground">Oct 24, 2023</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                        <Check size={16} />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                        <X size={16} />
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
  );
};

export default AdminDashboard;