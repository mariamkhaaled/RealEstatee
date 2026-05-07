import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Home as HomeIcon,
  Building,
  Briefcase,
  MapPin,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  Award,
  Users,
  Phone,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";

/* ─────────────────────────── static data ─────────────────────────── */

const FEATURE_CATEGORIES = [
  {
    icon: HomeIcon,
    label: "Houses",
    value: "Premium family homes",
    count: "2,400+",
    color: "#c8a96e",
  },
  {
    icon: Building,
    label: "Apartments",
    value: "City living redefined",
    count: "5,100+",
    color: "#7eb8d4",
  },
  {
    icon: Briefcase,
    label: "Offices",
    value: "Flexible business spaces",
    count: "870+",
    color: "#a8c5a0",
  },
  {
    icon: Sparkles,
    label: "Villas",
    value: "Luxury with comfort",
    count: "340+",
    color: "#d4a8c5",
  },
];

const STATS = [
  { value: "12K+", label: "Properties Listed", icon: HomeIcon },
  { value: "8.4K", label: "Happy Clients", icon: Users },
  { value: "98%", label: "Satisfaction Rate", icon: Award },
  { value: "24/7", label: "Expert Support", icon: Phone },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "First-time buyer",
    text: "LuxeEstates found us our dream home in under two weeks. The experience was seamless from search to close.",
    avatar: "SM",
    rating: 5,
    color: "#c8a96e",
  },
  {
    name: "James Harrington",
    role: "Property investor",
    text: "The platform's curated listings saved me hours of research. Closed three investment properties this quarter.",
    avatar: "JH",
    rating: 5,
    color: "#7eb8d4",
  },
  {
    name: "Layla Osman",
    role: "Luxury renter",
    text: "Found a penthouse with a view that exceeded every expectation. The team's attention to detail is extraordinary.",
    avatar: "LO",
    rating: 5,
    color: "#d4a8c5",
  },
];

/* ─────────────────────────── component ─────────────────────────── */

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchPurpose, setSearchPurpose] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    // Trigger hero animation
    const t = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/properties");
        const data = await res.json();

        type ApiProperty = Record<string, unknown>;
        const propertiesData = (data.data?.properties || []) as ApiProperty[];
        const mapped: Property[] = propertiesData.map((p) => {
          const propertyType =
            typeof p["property_type"] === "string" ? p["property_type"] : "";
          const purpose =
            typeof p["purpose"] === "string" ? p["purpose"] : "";
          const status =
            typeof p["status"] === "string" ? p["status"] : "";
          const images = Array.isArray(p["images"])
            ? (p["images"] as unknown[])
              .filter((img): img is string => typeof img === "string")
              .map((img) =>
                img.startsWith("http") ? img : `http://localhost:5000${img}`
              )
            : [];

          return {
            id: String(p["property_id"] ?? ""),
            title: typeof p["title"] === "string" ? p["title"] : "Property",
            description:
              typeof p["description"] === "string" ? p["description"] : "",
            price: Number(p["price"] ?? 0),
            location: `${typeof p["city"] === "string" ? p["city"] : ""
              }${typeof p["address"] === "string" ? `, ${p["address"]}` : ""
              }`,
            type: ["Apartment", "Villa", "Office", "House"].includes(
              propertyType as string
            )
              ? (propertyType as "Apartment" | "Villa" | "Office" | "House")
              : "Apartment",
            purpose: ["Sale", "Rent", "Installment"].includes(purpose)
              ? (purpose as "Sale" | "Rent" | "Installment")
              : "Sale",
            beds: Number(p["bedrooms"] ?? 0),
            baths: Number(p["bathrooms"] ?? 0),
            sqft: Number(p["area"] ?? 0),
            images,
            features: Array.isArray(p["features"])
              ? (p["features"] as unknown[]).filter(
                (f): f is string => typeof f === "string"
              )
              : [],
            ownerId: String(p["owner_id"] ?? ""),
            status: ["Pending", "Approved", "Rejected"].includes(status)
              ? (status as "Pending" | "Approved" | "Rejected")
              : "Pending",
            createdAt:
              typeof p["created_at"] === "string"
                ? p["created_at"]
                : new Date().toISOString(),
          };
        });

        setProperties(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .luxe-hero { font-family: 'Cormorant Garamond', Georgia, serif; }
        .luxe-body { font-family: 'DM Sans', system-ui, sans-serif; }
.num {
  font-family: 'DM Sans', system-ui, sans-serif !important;
  font-variant-numeric: tabular-nums;
}
        .hero-line {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1);
        }
        .hero-line.visible { opacity: 1; transform: none; }
        .hero-line:nth-child(1) { transition-delay: 0.05s; }
        .hero-line:nth-child(2) { transition-delay: 0.18s; }
        .hero-line:nth-child(3) { transition-delay: 0.30s; }
        .hero-line:nth-child(4) { transition-delay: 0.42s; }
        .hero-line:nth-child(5) { transition-delay: 0.56s; }
        .hero-line:nth-child(6) { transition-delay: 0.68s; }

        .stat-card {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .stat-card.visible { opacity: 1; transform: none; }
        .stat-card:nth-child(1) { transition-delay: 0.05s; }
        .stat-card:nth-child(2) { transition-delay: 0.15s; }
        .stat-card:nth-child(3) { transition-delay: 0.25s; }
        .stat-card:nth-child(4) { transition-delay: 0.35s; }

        .category-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s ease;
        }
        .category-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-accent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .category-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.10); }
        .category-card:hover::before { opacity: 0.05; }

        .search-panel {
          backdrop-filter: blur(20px);
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(200,169,110,0.25);
          box-shadow: 0 32px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(255,255,255,0.6) inset;
        }

        .gold-badge {
          background: linear-gradient(135deg, #c8a96e 0%, #e8d4a8 50%, #c8a96e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, rgba(200,169,110,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        .floating-card {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .noise-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .section-reveal {
          opacity: 0;
          transform: translateY(20px);
          animation: revealUp 0.8s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes revealUp {
          to { opacity: 1; transform: none; }
        }

        .testimonial-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .cta-glow {
          box-shadow: 0 0 0 0 rgba(200,169,110,0.4);
          animation: pulse-glow 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,169,110,0.35); }
          50% { box-shadow: 0 0 0 16px rgba(200,169,110,0); }
        }

        .property-tag {
          font-family: 'DM Sans', system-ui, sans-serif;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.68rem;
          font-weight: 500;
        }
      `}</style>

      <div className="luxe-body min-h-screen bg-[#faf9f7] text-[#1a1814]">

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="relative min-h-screen flex flex-col overflow-hidden noise-overlay">

          {/* Background image + layers */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=85"
              alt=""
              className="w-full h-full object-cover"
            />
            {/* gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0c0a]/75 via-[#0d0c0a]/40 to-[#0d0c0a]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0a]/60 to-transparent" />
          </div>

          {/* Decorative horizontal rule */}
          <div className="absolute top-0 left-0 right-0 h-px shimmer-line" />

          {/* Content */}
          <div className="relative flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-6 sm:px-12 lg:px-20">

            {/* Hero text block */}
            <div className="pt-28 pb-16 max-w-3xl">
              <div className={`hero-line property-tag text-[#c8a96e] mb-6 flex items-center gap-3 ${heroVisible ? "visible" : ""}`}>
                <span className="block w-8 h-px bg-[#c8a96e]" />
                Curated Real Estate Since 2018
              </div>

              <h1 className={`luxe-hero hero-line ${heroVisible ? "visible" : ""} text-white leading-[1.06]`}
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 300 }}>
                Find Your <br />
                <em style={{ fontStyle: "italic", fontWeight: 300 }}>Perfect</em>{" "}
                <span className="gold-badge">Residence</span>
              </h1>

              <p className={`hero-line ${heroVisible ? "visible" : ""} mt-6 text-[#d4cfc8] leading-relaxed max-w-xl`}
                style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
                Discover handpicked properties matched to your vision — from
                serene family homes to landmark penthouses.
              </p>

              <div className={`hero-line ${heroVisible ? "visible" : ""} mt-10 flex items-center gap-4 flex-wrap`}>
                <Link to="/properties">
                  <button className="cta-glow inline-flex items-center gap-2 rounded-full px-8 py-4 font-medium text-sm text-[#1a1814]"
                    style={{ background: "linear-gradient(135deg,#c8a96e,#e8d4a8,#c8a96e)", backgroundSize: "200% auto" }}>
                    Browse Listings
                    <ArrowRight size={15} />
                  </button>
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium text-white hover:border-white/50 transition-colors">
                  <Phone size={14} />
                  Talk to an Expert
                </button>
              </div>

              {/* Micro-stats inside hero */}
              <div className={`hero-line ${heroVisible ? "visible" : ""} mt-14 flex gap-8 flex-wrap`}>
                {[
                  { n: "12K+", l: "Listings" },
                  { n: "98%", l: "Satisfied" },
                  { n: "4.9★", l: "Rating" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="luxe-hero text-white text-2xl font-light num">
                      {s.n}
                    </p>
                    <p className="property-tag text-[#a09880] mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Search Panel ── */}
            <div className={`hero-line ${heroVisible ? "visible" : ""} w-full max-w-4xl mb-16`}>
              <div className="search-panel rounded-2xl p-6">
                <p className="property-tag text-[#a09880] mb-4">Search Properties</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {/* City */}
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c8a96e]" />
                    <input
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="City or neighborhood"
                      className="luxe-body w-full pl-9 pr-4 py-3.5 rounded-xl border border-[#e8e0d4] bg-[#faf9f7] text-sm outline-none focus:border-[#c8a96e] transition-colors"
                    />
                  </div>

                  {/* Type */}
                  <div className="relative">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="luxe-body w-full appearance-none px-4 py-3.5 rounded-xl border border-[#e8e0d4] bg-[#faf9f7] text-sm outline-none focus:border-[#c8a96e] transition-colors text-[#1a1814]"
                    >
                      <option value="">Property Type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>House</option>
                      <option>Office</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a09880] pointer-events-none" />
                  </div>

                  {/* Purpose */}
                  <div className="relative">
                    <select
                      value={searchPurpose}
                      onChange={(e) => setSearchPurpose(e.target.value)}
                      className="luxe-body w-full appearance-none px-4 py-3.5 rounded-xl border border-[#e8e0d4] bg-[#faf9f7] text-sm outline-none focus:border-[#c8a96e] transition-colors text-[#1a1814]"
                    >
                      <option value="">Purpose</option>
                      <option>Sale</option>
                      <option>Rent</option>
                      <option>Installment</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a09880] pointer-events-none" />
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    to={`/properties?city=${searchCity}&type=${searchType}&purpose=${searchPurpose}`}
                  >
                    <button className="w-full py-3.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#1a1814,#3a3428)" }}>
                      <Search size={15} />
                      Search Properties
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40">
            <p className="property-tag text-[10px]">Scroll</p>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </section>

        {/* ══════════════════════ STATS BAND ══════════════════════ */}
        <section ref={statsRef} className="bg-[#1a1814] py-14">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`stat-card text-center ${statsVisible ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
                    style={{ background: "rgba(200,169,110,0.12)", border: "1px solid rgba(200,169,110,0.25)" }}>
                    <s.icon size={18} className="text-[#c8a96e]" />
                  </div>
                  <p
                    className="text-white font-light num"
                    style={{ fontSize: "2rem" }}
                  >
                    {s.value}
                  </p>
                  <p className="property-tag text-[#6b6254] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ CATEGORIES ══════════════════════ */}
        <section className="py-24 bg-[#faf9f7]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">

            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="property-tag text-[#c8a96e] mb-3">Property Types</p>
                <h2 className="luxe-hero font-light text-[#1a1814]"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                  Every lifestyle, <em>perfectly</em> matched
                </h2>
              </div>
              <p className="text-[#7a7060] max-w-xs text-sm leading-relaxed">
                From urban studios to sprawling villas — curated selections for
                every life chapter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURE_CATEGORIES.map((cat) => (
                <Link to="/properties" key={cat.label}>
                  <div
                    className="category-card rounded-2xl border border-[#e8e0d4] bg-white p-7 cursor-pointer"
                    style={{ "--card-accent": cat.color } as React.CSSProperties}
                  >
                    {/* Icon bubble */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                      style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35` }}>
                      <cat.icon size={20} style={{ color: cat.color }} />
                    </div>

                    <h3 className="luxe-hero text-[#1a1814] font-normal text-xl mb-1">{cat.label}</h3>
                    <p className="text-sm text-[#7a7060] mb-5">{cat.value}</p>

                    <div className="flex items-center justify-between">
                      <span className="property-tag text-[#a09880]">{cat.count} listings</span>
                      <div className="w-7 h-7 rounded-full border border-[#e8e0d4] flex items-center justify-center">
                        <ArrowRight size={12} className="text-[#7a7060]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ FEATURED PROPERTIES ══════════════════════ */}
        <section className="py-24 bg-[#f5f2ed]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="property-tag text-[#c8a96e] mb-3">Featured</p>
                <h2 className="luxe-hero font-light text-[#1a1814]"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                  Hand-picked <em>excellence</em>
                </h2>
              </div>
              <Link to="/properties">
                <button className="inline-flex items-center gap-2 rounded-full border border-[#c8a96e] px-6 py-3 text-sm text-[#c8a96e] hover:bg-[#c8a96e] hover:text-white transition-colors font-medium">
                  View All Listings
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-[#e8e0d4] animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d4cfc8] bg-white py-16 text-center text-[#7a7060]">
                No featured properties available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════ ABOUT / SPLIT ══════════════════════ */}
        <section className="py-24 bg-[#faf9f7]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-14 items-center">

              {/* Images mosaic */}
              <div className="relative h-[560px]">
                <img
                  src="https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&q=80"
                  alt="Interior"
                  className="absolute top-0 left-0 w-[68%] h-[72%] object-cover rounded-2xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                  alt="Exterior"
                  className="absolute bottom-0 right-0 w-[55%] h-[55%] object-cover rounded-2xl"
                  style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
                />

                {/* Floating badge */}
                <div className="floating-card absolute bottom-[52%] right-[28%] translate-x-1/2 translate-y-1/2 z-10">
                  <div className="bg-white rounded-2xl px-5 py-4 shadow-xl border border-[#e8e0d4] text-center min-w-[120px]">
                    <p className="luxe-hero text-[#c8a96e] text-2xl font-light">6+</p>
                    <p className="property-tag text-[#7a7060] mt-0.5">Years Trust</p>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="property-tag text-[#c8a96e] mb-4">Our Story</p>
                <h2 className="luxe-hero font-light text-[#1a1814] mb-6"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                  More than a marketplace — <em>a relationship</em>
                </h2>
                <p className="text-[#7a7060] leading-relaxed mb-6 text-sm">
                  Founded on the belief that finding a home should feel inspiring
                  rather than overwhelming, LuxeEstates has connected thousands
                  of families, investors, and professionals with spaces that
                  genuinely resonate.
                </p>
                <p className="text-[#7a7060] leading-relaxed mb-10 text-sm">
                  Every listing is verified. Every agent is vetted. And every
                  client receives the personalized attention they deserve — from
                  first search to final signature.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: ShieldCheck, label: "Verified Listings", desc: "Every property is authenticated" },
                    { icon: Star, label: "Top Rated", desc: "4.9 / 5 client satisfaction" },
                    { icon: TrendingUp, label: "Market Insights", desc: "Data-driven property advice" },
                    { icon: Award, label: "Award Winning", desc: "Best platform 2023 & 2024" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3 items-start">
                      <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(200,169,110,0.12)" }}>
                        <item.icon size={15} className="text-[#c8a96e]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1814]">{item.label}</p>
                        <p className="text-xs text-[#7a7060] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
        <section className="py-24 bg-[#1a1814] relative overflow-hidden">
          {/* decorative arc */}
          <div className="absolute top-0 left-0 w-full h-1 shimmer-line" />

          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="text-center mb-14">
              <p className="property-tag text-[#c8a96e] mb-3">Testimonials</p>
              <h2 className="luxe-hero font-light text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                Voices of those <em>who found home</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="testimonial-card rounded-2xl p-7"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-[#c8a96e] fill-[#c8a96e]" />
                    ))}
                  </div>

                  <p className="text-[#d4cfc8] text-sm leading-relaxed mb-7">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ background: `${t.color}40`, border: `1px solid ${t.color}60` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="property-tag text-[#6b6254] mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ CTA BANNER ══════════════════════ */}
        <section className="py-24 bg-[#faf9f7]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="relative overflow-hidden rounded-3xl"
              style={{
                background: "linear-gradient(135deg, #1a1814 0%, #2e2a22 60%, #3a3428 100%)",
              }}>

              {/* Decorative circle */}
              <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #c8a96e, transparent 70%)" }} />
              <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #c8a96e, transparent 70%)" }} />

              <div className="relative px-10 py-16 md:px-20 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                  <p className="property-tag text-[#c8a96e] mb-3">Start Today</p>
                  <h2 className="luxe-hero font-light text-white"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                    Your next chapter <em>awaits</em>
                  </h2>
                  <p className="text-[#a09880] mt-3 max-w-md text-sm leading-relaxed">
                    Join thousands who found their perfect space through
                    LuxeEstates. No pressure, just possibilities.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <Link to="/properties">
                    <button className="cta-glow inline-flex items-center gap-2 rounded-full px-8 py-4 font-medium text-sm text-[#1a1814]"
                      style={{ background: "linear-gradient(135deg,#c8a96e,#e8d4a8,#c8a96e)" }}>
                      Browse Listings
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm text-white hover:border-white/40 transition-colors">
                      Create Account
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;