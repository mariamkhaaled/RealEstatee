import { useEffect, useState, useCallback } from "react";
import PropertyCard from "@/components/PropertyCard";
import {
  Search,
  SlidersHorizontal,
  X,
  Home,
  Building2,
  Trees,
  Briefcase,
  MapPin,
} from "lucide-react";
import { Property } from "@/types";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
);

const PURPOSES = ["All", "For Sale", "For Rent"] as const;

const TYPES = [
  { label: "All", icon: null },
  { label: "Apartment", icon: Building2 },
  { label: "Villa", icon: Trees },
  { label: "House", icon: Home },
  { label: "Office", icon: Briefcase },
] as const;

export default function Properties() {
  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("All");
  const [type, setType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [all, setAll] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/properties");
        const data = await res.json();
        const mapped: Property[] = (data.data?.properties || []).map(
          (p: any) => ({
            id: String(p.property_id),
            title: p.title,
            description: p.description,
            price: Number(p.price),
            location: `${p.city}${p.address ? `, ${p.address}` : ""}`,
            type: p.property_type,
            purpose: p.purpose,
            beds: p.bedrooms,
            baths: p.bathrooms,
            sqft: p.area,
            images: (p.images || []).map((img: string) =>
              img.startsWith("http") ? img : `http://localhost:5000${img}`,
            ),
            features: p.features || [],
            ownerId: String(p.owner_id || ""),
            status: p.status,
            createdAt: new Date().toISOString(),
          }),
        );

        const activeOnly = mapped.filter((p) => p.status === "Active");
        setAll(activeOnly);
        setFiltered(activeOnly);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applyFilters = useCallback(() => {
    let r = all;

    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false),
      );
    }

    if (purpose !== "All") {
      r = r.filter((p) =>
        purpose === "For Sale" ? p.purpose === "Sale" : p.purpose === "Rent",
      );
    }

    if (type !== "All") r = r.filter((p) => p.type === type);
    if (minPrice) r = r.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) r = r.filter((p) => p.price <= Number(maxPrice));

    setFiltered(r);
    setDrawerOpen(false);
  }, [all, search, purpose, type, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setPurpose("All");
    setType("All");
    setMinPrice("");
    setMaxPrice("");
    setFiltered(all);
  };

  const hasActive = !!(
    search ||
    purpose !== "All" ||
    type !== "All" ||
    minPrice ||
    maxPrice
  );

  const FilterPanel = () => (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 14,
          marginBottom: 14,
          borderBottom: "1px solid rgba(200,169,110,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={13} color="#4e3b1f" />
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#5c4a2a",
            }}
          >
            Filters
          </span>
        </div>

        {hasActive && (
          <button
            onClick={clearFilters}
            style={{
              fontSize: 10,
              border: "none",
              background: "none",
              color: "#c8a96e",
              cursor: "pointer",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.82";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <X size={9} /> Clear
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* keyword */}
        <div>
          <label
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a08555",
            }}
          >
            Keyword
          </label>

          <div style={{ position: "relative", marginTop: 6 }}>
            <Search
              size={12}
              style={{
                position: "absolute",
                left: 10,
                top: 12,
                color: "#c8a96e",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%",
                height: 36,
                paddingLeft: 32,
                borderRadius: 8,
                border: "1px solid rgba(200,169,110,0.25)",
                fontSize: 12,
              }}
            />
          </div>
        </div>

        {/* purpose */}
        <div>
          <label
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a08555",
            }}
          >
            Purpose
          </label>

          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {PURPOSES.map((p) => (
              <button
                key={p}
                onClick={() => setPurpose(p)}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 8,
                  fontSize: 11,
                  border: "1px solid rgba(200,169,110,0.25)",
                  background: purpose === p ? "#c8a96e" : "transparent",
                  color: purpose === p ? "#2a1f0e" : "#8a7050",
                  cursor: "pointer",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (purpose !== p) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(200,169,110,0.08)";
                  }
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    purpose === p ? "#c8a96e" : "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* type */}
        <div>
          <label
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a08555",
            }}
          >
            Type
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              marginTop: 6,
            }}
          >
            {TYPES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setType(label)}
                style={{
                  height: 34,
                  fontSize: 11,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: "center",
                  border: "1px solid rgba(200,169,110,0.25)",
                  background: type === label ? "#c8a96e" : "transparent",
                  cursor: "pointer",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (type !== label) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(200,169,110,0.08)";
                  }
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    type === label ? "#c8a96e" : "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {Icon && <Icon size={12} />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* price */}
        <div>
          <label
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a08555",
            }}
          >
            Price
          </label>

          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <input
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ flex: 1, height: 34, fontSize: 12, borderRadius: 8 }}
            />
            <input
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ flex: 1, height: 34, fontSize: 12, borderRadius: 8 }}
            />
          </div>
        </div>

        <button
          onClick={applyFilters}
          style={{
            height: 38,
            borderRadius: 10,
            fontSize: 10,
            letterSpacing: "0.16em",
            background: "#1a1814",
            color: "#e8d4a8",
            border: "none",
            cursor: "pointer",
            transition:
              "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.filter = "brightness(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <FontLink />

      <div
        style={{
          display: "flex",
          gap: 18,
          padding: 24,
          alignItems: "flex-start",
        }}
      >
        {/* sidebar */}
        <aside
          style={{
            width: 320,
            minWidth: 320,
            flexShrink: 0,
            position: "sticky",
            top: 80,
          }}
        >
          <div
            style={{
              background: "rgba(255,253,248,0.9)",
              borderRadius: 14,
              padding: 16,
              border: "1px solid rgba(200,169,110,0.2)",
            }}
          >
            <FilterPanel />
          </div>
        </aside>

        {/* main */}
        <main style={{ flex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
