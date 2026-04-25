import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property } from "@/types";

const FEATURE_CATEGORIES = [
  { icon: HomeIcon, label: "Houses", value: "Premium family homes" },
  { icon: Building, label: "Apartments", value: "City living made easy" },
  { icon: Briefcase, label: "Offices", value: "Flexible business spaces" },
  { icon: Sparkles, label: "Villas", value: "Luxury with comfort" },
];

const HERO_STATS = [
  { icon: ShieldCheck, label: "Verified listings", value: "100%" },
  { icon: Star, label: "Top rated service", value: "4.9/5" },
  { icon: Sparkles, label: "Fast support", value: "24/7" },
];

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/properties");
        const data = await res.json();

        type ApiProperty = Record<string, unknown>;
        const propertiesData = (data.data?.properties || []) as ApiProperty[];
        const mapped: Property[] = propertiesData.map((p) => {
          const propertyType = typeof p["property_type"] === "string" ? p["property_type"] : "";
          const purpose = typeof p["purpose"] === "string" ? p["purpose"] : "";
          const status = typeof p["status"] === "string" ? p["status"] : "";
          const images = Array.isArray(p["images"])
            ? (p["images"] as unknown[])
                .filter((img): img is string => typeof img === "string")
                .map((img) => (img.startsWith("http") ? img : `http://localhost:5000${img}`))
            : [];

          return {
            id: String(p["property_id"] ?? ""),
            title: typeof p["title"] === "string" ? p["title"] : "Property",
            description: typeof p["description"] === "string" ? p["description"] : "",
            price: Number(p["price"] ?? 0),
            location: `${typeof p["city"] === "string" ? p["city"] : ""}${typeof p["address"] === "string" ? `, ${p["address"]}` : ""}`,
            type: ["Apartment", "Villa", "Office", "House"].includes(propertyType as string)
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
              ? (p["features"] as unknown[]).filter((feature): feature is string => typeof feature === "string")
              : [],
            ownerId: String(p["owner_id"] ?? ""),
            status: ["Pending", "Approved", "Rejected"].includes(status)
              ? (status as "Pending" | "Approved" | "Rejected")
              : "Pending",
            createdAt: typeof p["created_at"] === "string" ? p["created_at"] : new Date().toISOString(),
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
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
            alt="Hero background"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles size={16} /> Curated homes for your lifestyle
              </div>

              <div className="max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                  Find the perfect home, apartment or office with modern comfort.
                </h1>
                <p className="mt-5 text-lg leading-8 text-slate-300 sm:text-xl">
                  Browse premium real estate listings, explore verified neighborhoods, and connect with trusted agents.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Button size="lg" className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  Browse Listings
                </Button>
                <Button variant="outline" size="lg" className="w-full text-white border-white/20 hover:border-white">
                  Contact Agent
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 text-white shadow-sm shadow-slate-950/10 backdrop-blur transition hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white">
                      <stat.icon size={20} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Quick search</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Search your next property</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Search by city, property type, and price with one smart search.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input placeholder="Search city or neighborhood" className="pl-12 h-14 rounded-3xl bg-slate-950/70 border border-white/10 text-white" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <select className="h-14 rounded-3xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none focus:border-primary">
                    <option>Property type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>House</option>
                    <option>Office</option>
                  </select>
                  <select className="h-14 rounded-3xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none focus:border-primary">
                    <option>Purpose</option>
                    <option>Sale</option>
                    <option>Rent</option>
                    <option>Installment</option>
                  </select>
                </div>
                <Button size="lg" className="w-full h-14 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Search className="mr-2" size={18} />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Explore categories</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Properties for every lifestyle</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-500">From modern apartments to premium villas, explore curated spaces built for comfort and style.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_CATEGORIES.map((category) => (
            <div key={category.label} className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <category.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{category.label}</h3>
              <p className="mt-3 text-sm text-slate-500">{category.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-6 items-center">

          <div className="bg-slate-950 text-white p-10 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-slate-300">
              We provide the best real estate experience with trusted agents, modern properties, and seamless transactions.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1600585152915-d208bec867a1"
            className="rounded-3xl w-full object-cover h-full"
          />

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Featured properties</h2>
            <p className="mt-2 text-sm text-slate-500">Handpicked listings from our live database.</p>
          </div>
          <Link to="/properties">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading featured properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No featured properties available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;