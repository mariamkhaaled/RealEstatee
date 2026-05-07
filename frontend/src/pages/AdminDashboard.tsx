import React, { useEffect, useState } from 'react';
import { 
  MoreHorizontal, Check, X, MapPin, User
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

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOwners: 0,
    recentUsers: [] as any[]
  });

  // 🔐 Security Check
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Inside AdminDashboard.tsx
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 

      const [propertiesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/properties'),
        fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const propertiesData = await propertiesRes.json();
      const statsData = await statsRes.json();
      
      // 👇 THIS WILL PRINT THE DB RESPONSE TO YOUR BROWSER CONSOLE 👇
      console.log("Stats API Response:", statsData);
      
      if (propertiesRes.ok) {
        const all = propertiesData.data?.properties || [];
        setPendingListings(all.filter((p: Property) => p.status === 'Pending'));
        setRecentListings(all.filter((p: Property) => p.status === 'Active').slice(0, 5));
      }

      if (statsRes.ok) {
        setStats(statsData.data);
      } else {
        console.error("Backend refused stats request:", statsData);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
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
  <>
    {/* Luxury Editorial Dashboard Theme */}
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');

      .lux-dashboard {
        font-family: 'DM Sans', sans-serif;
        background: #faf9f7;
        color: #1a1814;
      }

      .lux-title {
        font-family: 'Cormorant Garamond', serif;
      }

      .lux-card {
        background: rgba(255,255,255,0.78);
        backdrop-filter: blur(18px);
        border: 1px solid rgba(200,169,110,0.14);
        box-shadow:
          0 10px 40px rgba(0,0,0,0.04),
          inset 0 1px 0 rgba(255,255,255,0.5);
      }

      .lux-card-hover {
        transition:
          transform .35s cubic-bezier(.16,1,.3,1),
          box-shadow .35s ease,
          border-color .35s ease;
      }

      .lux-card-hover:hover {
        transform: translateY(-4px);
        border-color: rgba(200,169,110,0.35);
        box-shadow:
          0 22px 60px rgba(0,0,0,0.08),
          inset 0 1px 0 rgba(255,255,255,0.6);
      }

      .lux-gold {
        color: #c8a96e;
      }

      .lux-muted {
        color: #8b8173;
      }

      .lux-btn-gold {
        background: linear-gradient(
          135deg,
          #c8a96e 0%,
          #e8d4a8 50%,
          #c8a96e 100%
        );
        color: #1a1814;
        transition: all .35s ease;
      }

      .lux-btn-gold:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 28px rgba(200,169,110,0.28);
      }

      .lux-btn-outline {
        border: 1px solid rgba(200,169,110,0.2);
        transition: all .3s ease;
      }

      .lux-btn-outline:hover {
        border-color: #c8a96e;
        color: #c8a96e;
      }

      .lux-table-row {
        transition: background .25s ease;
      }

      .lux-table-row:hover {
        background: rgba(200,169,110,0.04);
      }

      .lux-tag {
        letter-spacing: .18em;
        text-transform: uppercase;
        font-size: .66rem;
        font-weight: 600;
      }

      .lux-map .leaflet-container {
        border-radius: 1rem;
        font-family: 'DM Sans', sans-serif;
      }

      .lux-chart-line-1 {
        stroke: #c8a96e;
      }

      .lux-chart-line-2 {
        stroke: #d8c4a0;
      }
    `}</style>

    <div className="lux-dashboard min-h-screen">
      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">

          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#e8e0d4] shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${user.full_name}&background=f5f2ed&color=1a1814`}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="lux-tag lux-gold mb-2">
                Admin Dashboard
              </p>

              <h1 className="lux-title text-5xl font-light text-[#1a1814] leading-none">
                Welcome back,
                <em className="ml-2">
                  {user.full_name?.split(" ")[0] || "Admin"}
                </em>
              </h1>

              <p className="text-sm lux-muted mt-3">
                Manage listings, approvals, analytics, and regional activity.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="xl:col-span-2 space-y-8">

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Revenue */}
              <div className="lux-card lux-card-hover rounded-3xl p-7 flex flex-col justify-between min-h-[180px]">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="lux-tag lux-muted mb-3">
                      Total Revenue
                    </p>

                    <h3 className="lux-title text-5xl font-light">
                      $783K
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#c8a96e]/10 border border-[#c8a96e]/20">
                    💰
                  </div>
                </div>

                <div className="flex items-end justify-between mt-8">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">
                      +28% Growth
                    </p>
                    <p className="text-xs lux-muted mt-1">
                      Compared to last week
                    </p>
                  </div>
                </div>
              </div>

              {/* Costs */}
              <div className="lux-card lux-card-hover rounded-3xl p-7 flex flex-col justify-between min-h-[180px]">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="lux-tag lux-muted mb-3">
                      Maintenance Cost
                    </p>

                    <h3 className="lux-title text-5xl font-light">
                      $582K
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#c8a96e]/10 border border-[#c8a96e]/20">
                    🔧
                  </div>
                </div>

                <div className="flex items-end justify-between mt-8">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">
                      +15% Growth
                    </p>
                    <p className="text-xs lux-muted mt-1">
                      Compared to last week
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="lux-card rounded-3xl p-8">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="lux-tag lux-gold mb-2">
                    Performance
                  </p>

                  <h3 className="lux-title text-3xl font-light">
                    Revenue Overview
                  </h3>
                </div>

                <select className="bg-[#f5f2ed] border border-[#e8e0d4] rounded-xl px-4 py-2 text-sm outline-none">
                  <option>Last 5 Years</option>
                </select>
              </div>

              <div className="h-[220px]">
                <svg
                  viewBox="0 0 400 150"
                  className="w-full h-full overflow-visible"
                >
                  <path
                    d="M0,80 Q50,30 100,70 T200,50 T300,90 T400,20"
                    fill="none"
                    className="lux-chart-line-1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M0,100 Q50,120 100,90 T200,110 T300,60 T400,90"
                    fill="none"
                    className="lux-chart-line-2"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Pending Listings */}
            <div className="lux-card rounded-3xl overflow-hidden">

              <div className="px-8 py-7 border-b border-[#f1ece4]">
                <p className="lux-tag lux-gold mb-2">
                  Moderation
                </p>

                <h3 className="lux-title text-3xl font-light">
                  Pending Listings
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-[#faf7f2]">
                    <tr className="text-left text-[#8b8173]">
                      <th className="px-8 py-5 font-medium">Owner</th>
                      <th className="px-8 py-5 font-medium">Location</th>
                      <th className="px-8 py-5 font-medium">Type</th>
                      <th className="px-8 py-5 font-medium">Price</th>
                      <th className="px-8 py-5 font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 lux-muted"
                        >
                          Loading listings...
                        </td>
                      </tr>
                    ) : pendingListings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 lux-muted"
                        >
                          No pending approvals.
                        </td>
                      </tr>
                    ) : (
                      pendingListings.map((prop) => (
                        <tr
                          key={prop.listing_id}
                          className="lux-table-row border-t border-[#f5f2ed]"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://ui-avatars.com/api/?name=${prop.owner_name}&background=f5f2ed&color=1a1814`}
                                className="w-10 h-10 rounded-full border border-[#e8e0d4]"
                                alt="avatar"
                              />

                              <span className="font-medium text-[#1a1814]">
                                {prop.owner_name}
                              </span>
                            </div>
                          </td>

                          <td className="px-8 py-6 lux-muted">
                            {prop.city}
                          </td>

                          <td className="px-8 py-6 lux-muted">
                            {prop.purpose}
                          </td>

                          <td className="px-8 py-6 font-semibold text-[#1a1814]">
                            ${Number(prop.price).toLocaleString()}
                          </td>

                          <td className="px-8 py-6">
                            <div className="flex gap-3">

                              <button
                                onClick={() =>
                                  handleDecision(
                                    prop.listing_id,
                                    "Active"
                                  )
                                }
                                className="lux-btn-gold rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-2"
                              >
                                <Check size={13} />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleDecision(
                                    prop.listing_id,
                                    "Closed"
                                  )
                                }
                                className="lux-btn-outline rounded-full px-5 py-2 text-xs font-semibold text-[#7a7060] flex items-center gap-2"
                              >
                                <X size={13} />
                                Reject
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

          {/* RIGHT */}
          <div className="space-y-8">

            {/* Property List */}
            <div className="lux-card rounded-3xl p-7">

              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="lux-tag lux-gold mb-2">
                    Featured
                  </p>

                  <h3 className="lux-title text-3xl font-light">
                    Recent Listings
                  </h3>
                </div>

                <Link
                  to="/properties"
                  className="text-sm font-medium lux-gold hover:opacity-70"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-6">
                {recentListings.length > 0 ? (
                  recentListings.map((prop, idx) => (
                    <div
                      key={idx}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-40 rounded-2xl overflow-hidden mb-4">

                        <img
                          src={getPropertyImage(prop.images)}
                          alt={prop.title}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#1a1814]">
                          #{idx + 1} Featured
                        </div>
                      </div>

                      <h4 className="font-semibold text-[#1a1814] text-sm truncate">
                        {prop.title}
                      </h4>

                      <p className="text-xs lux-muted mt-1 flex items-center gap-1">
                        <MapPin size={12} />
                        {prop.city}
                      </p>

                      <p className="lux-title text-2xl font-light mt-2">
                        ${Number(prop.price).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm lux-muted">
                    No active listings available.
                  </p>
                )}
              </div>
            </div>

            {/* Region Map */}
            <div className="lux-card rounded-3xl p-7 lux-map">

              <div className="mb-6">
                <p className="lux-tag lux-gold mb-2">
                  Analytics
                </p>

                <h3 className="lux-title text-3xl font-light">
                  Sales by Region
                </h3>
              </div>

              <div className="w-full h-72 overflow-hidden rounded-2xl border border-[#e8e0d4]">

                <MapContainer
                  center={[30.0444, 31.2357]}
                  zoom={6}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />

                  <Marker
                    position={[30.0444, 31.2357]}
                    icon={defaultPin}
                  >
                    <Popup>
                      High Activity: Cairo
                    </Popup>
                  </Marker>

                  <Marker
                    position={[31.2001, 29.9187]}
                    icon={defaultPin}
                  >
                    <Popup>
                      High Activity: Alexandria
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </>
);
};

export default AdminDashboard;
