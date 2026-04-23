import React, { useEffect, useState } from 'react';
import { 
  MoreHorizontal, Check, X, MapPin
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

// Add these to your existing imports at the top
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Setup default marker icon pointing to external URLs to avoid bundler image issues
const defaultPin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


interface Property {
  property_id: number;
  listing_id: number;
  title: string;
  city: string;
  owner_name: string;
  price: number;
  purpose: string;
  status: string;
  images: string[];
}

const AdminDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [pendingListings, setPendingListings] = useState<Property[]>([]);
  const [recentListings, setRecentListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Security Check
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/properties'); 
      const data = await res.json();
      
      if (res.ok) {
        const all = data.data?.properties || [];
        setPendingListings(all.filter((p: Property) => p.status === 'Pending'));
        setRecentListings(all.filter((p: Property) => p.status === 'Active').slice(0, 2));
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDecision = async (listingId: number, decision: 'Active' | 'Closed') => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ UPDATED URL: Now points to the new propertyController route
      const res = await fetch(`http://localhost:5000/api/properties/listing-status/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: decision })
      });

      if (res.ok) {
        toast.success(decision === 'Active' ? "Listing Approved" : "Listing Rejected");
        setPendingListings(prev => prev.filter(l => l.listing_id !== listingId));
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update");
      }
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    }
  };

  const getPropertyImage = (images: string[] = []) => {
    const raw = images[0];
    if (!raw) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80";
    return raw.startsWith('http') ? raw : `http://localhost:5000${raw}`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] font-sans text-slate-800">
      <main className="max-w-[1600px] mx-auto p-6 lg:p-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden hidden sm:block">
               <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=eff6ff&color=1e40af`} alt="Admin" className="w-full h-full object-cover"/>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Welcome Back</p>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Good Morning {user.full_name?.split(' ')[0] || 'Admin'} 👋
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[130px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">💰</span>
                      Total Revenue
                    </div>
                    <MoreHorizontal size={16} className="text-slate-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-slate-800">$783,156</h3>
                    <div className="text-right">
                      <span className="text-emerald-500 text-sm font-bold block">+28%</span>
                      <span className="text-[10px] text-slate-400">From last week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[130px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">🔧</span>
                      Maintenance Cost
                    </div>
                    <MoreHorizontal size={16} className="text-slate-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-slate-800">$582,473</h3>
                    <div className="text-right">
                      <span className="text-emerald-500 text-sm font-bold block">+15%</span>
                      <span className="text-[10px] text-slate-400">From last week</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800">Total Revenue</h3>
                    <div className="flex gap-3 text-[10px] font-medium mt-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span>Income</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Expense</span>
                    </div>
                  </div>
                  <select className="text-xs border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-500 outline-none">
                    <option>Last 5 years</option>
                  </select>
                </div>
                <div className="flex-1 w-full relative min-h-[140px]">
                  <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                    <path d="M0,80 Q50,30 100,70 T200,50 T300,90 T400,20" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                    <path d="M0,100 Q50,120 100,90 T200,110 T300,60 T400,90" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Listings Offers <span className="text-sm font-normal text-slate-400 ml-2">(Pending Approvals)</span></h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-slate-400 font-medium bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Owner</th>
                      <th className="px-6 py-4 font-medium">Location</th>
                      <th className="px-6 py-4 font-medium">Sales Type</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading pending offers...</td></tr>
                    ) : pendingListings.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">No pending approvals at the moment.</td></tr>
                    ) : (
                      pendingListings.map((prop) => (
                        <tr key={prop.listing_id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={`https://ui-avatars.com/api/?name=${prop.owner_name}&background=f1f5f9&color=475569`} className="w-8 h-8 rounded-full" alt="avatar" />
                              <span className="font-medium text-slate-700">{prop.owner_name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{prop.city}</td>
                          <td className="px-6 py-4 text-slate-500">{prop.purpose}</td>
                          <td className="px-6 py-4 font-semibold text-slate-700">${Number(prop.price).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleDecision(prop.listing_id, 'Active')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1 border border-emerald-100"
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button 
                                onClick={() => handleDecision(prop.listing_id, 'Closed')}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1 border border-rose-100"
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Property List</h3>
                  <Link to="/properties" className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">
                    See All Listing
                   </Link> 
          </div>
              
              <div className="space-y-5">
                {recentListings.length > 0 ? recentListings.map((prop, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                      <img src={getPropertyImage(prop.images)} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        {idx + 1} New Offers
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{prop.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{prop.city}</p>
                    <p className="font-bold text-slate-800 mt-1">${Number(prop.price).toLocaleString()}</p>
                  </div>
                )) : (
                   <p className="text-sm text-slate-400">No active properties available.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
    <h3 className="font-bold text-slate-800 text-lg mb-4">Sales by Region</h3>
    {/* z-0 ensures the map doesn't overlap any sticky navbars */}
    <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-100 z-0">
      <MapContainer 
        center={[30.0444, 31.2357]} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Using CartoDB Voyager tiles for a clean, light aesthetic that matches your dashboard */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Example Pins corresponding to common listing areas */}
        <Marker position={[30.0444, 31.2357]} icon={defaultPin}>
          <Popup className="font-sans font-medium text-slate-800">High Activity: Cairo</Popup>
        </Marker>
        <Marker position={[31.2001, 29.9187]} icon={defaultPin}>
          <Popup className="font-sans font-medium text-slate-800">High Activity: Alexandria</Popup>
        </Marker>
      </MapContainer>
  </div>
</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
