import { useState } from "react";
import { MapPin, Bed, Bath, Maximize2, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Property } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useFavorites } from "@/context/FavoritesContext";

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string) => void;
}

const PropertyCard = ({ property, onFavoriteToggle }: PropertyCardProps) => {
  const { isFavorite, addFavorite, removeFavorite, setPendingFavoriteId } = useFavorites();
  const [loading, setLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fav = isFavorite(property.id);
  const navigate = useNavigate();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setPendingFavoriteId(property.id);
      setShowAuthDialog(true);
      return;
    }
    try {
      setLoading(true);
      if (fav) {
        await fetch(`http://localhost:5000/api/favorites/${property.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        removeFavorite(property.id);
        onFavoriteToggle?.(property.id);
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ property_id: property.id }),
        });
        addFavorite(property.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const imgSrc =
    property.images?.[0]
      ? property.images[0].startsWith("http")
        ? property.images[0]
        : `http://localhost:5000${property.images[0]}`
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        .pc-root { font-family: 'DM Sans', sans-serif; }
        .pc-img { transition: transform 0.8s cubic-bezier(.16,1,.3,1); }
        .pc-root:hover .pc-img { transform: scale(1.06); }
        .pc-fav { transition: transform 0.22s cubic-bezier(.16,1,.3,1), background 0.22s; }
        .pc-fav:hover { transform: scale(1.15); }
        .pc-btn { transition: background 0.28s cubic-bezier(.16,1,.3,1), letter-spacing 0.28s, color 0.28s; }
        .pc-btn:hover { background: linear-gradient(135deg,#c8a96e,#e8d4a8) !important; letter-spacing: 0.22em; }
        .pc-root { transition: box-shadow 0.35s cubic-bezier(.16,1,.3,1), transform 0.35s cubic-bezier(.16,1,.3,1); }
        .pc-root:hover { transform: translateY(-4px); box-shadow: 0 24px 48px rgba(200,169,110,0.16), 0 4px 12px rgba(0,0,0,0.06) !important; }
        .pc-purpose { font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; }
        .pc-title { font-family: 'Cormorant Garamond', serif; font-weight: 400; }
        .pc-price { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      <div
        className="pc-root"
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          background: '#fffdf8',
          border: '1px solid rgba(200,169,110,0.2)',
          boxShadow: '0 4px 24px rgba(200,169,110,0.08)',
        }}
      >
        {/* ── Image ── */}
        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#f5efe2' }}>
          <img
            src={imgSrc}
            alt={property.title}
            className="pc-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Cinematic gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,8,0.55) 0%, transparent 55%)' }} />

          {/* Purpose pill — bottom left, over image */}
          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <span className="pc-purpose" style={{
              display: 'inline-block',
              padding: '5px 12px',
              borderRadius: 100,
              background: 'linear-gradient(135deg,#c8a96e,#e8d4a8)',
              color: '#3d2c0e',
            }}>
              For {property.purpose}
            </span>
          </div>

          {/* Price — bottom right, over image */}
          <div style={{ position: 'absolute', bottom: 12, right: 14 }}>
            <span className="pc-price" style={{
              fontSize: 18,
              fontWeight: 400,
              color: '#f5ead2',
              letterSpacing: '0.01em',
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}>
              ${property.price.toLocaleString()}
              {property.purpose === 'Rent' && (
                <span style={{ fontSize: 11, fontWeight: 300, color: '#dcc8a0', marginLeft: 3 }}>/mo</span>
              )}
            </span>
          </div>

          {/* Favorite btn */}
          <button
            disabled={loading}
            onClick={handleToggleFavorite}
            className="pc-fav"
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 34, height: 34, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
            }}
          >
            <Heart
              size={15}
              color={fav ? '#c8a96e' : 'rgba(255,255,255,0.9)'}
              fill={fav ? '#c8a96e' : 'none'}
            />
          </button>

          {/* Type pill — top left */}
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, fontWeight: 500,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
            }}>
              {property.type}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '18px 18px 16px' }}>

          {/* Title + location */}
          <h3 className="pc-title" style={{
            fontSize: 19, lineHeight: 1.2, color: '#1a1410',
            margin: '0 0 6px', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
          }}>
            {property.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            <MapPin size={12} color="#c8a96e" strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#9a8060', letterSpacing: '0.02em', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {property.location}
            </span>
          </div>

          {/* Thin gold rule */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(200,169,110,0.5),rgba(200,169,110,0.08))', marginBottom: 16 }} />

          {/* Specs row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
            {[
              { icon: Bed,       value: property.beds,  label: 'Beds'  },
              { icon: Bath,      value: property.baths, label: 'Baths' },
              { icon: Maximize2, value: property.sqft,  label: 'sqft'  },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, borderRight: i < 2 ? '1px solid rgba(200,169,110,0.18)' : 'none' }}>
                <Icon size={13} color="#c8a96e" strokeWidth={1.5} />
                <span style={{ fontSize: 12, color: '#6b5636', fontWeight: 400 }}>
                  <strong style={{ fontWeight: 500, color: '#3d2c17' }}>{value}</strong>
                  {' '}{label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            to={`/property-details/${property.id}`}
            className="pc-btn"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              padding: '11px 0', borderRadius: 10,
              background: 'rgba(200,169,110,0.1)',
              border: '1px solid rgba(200,169,110,0.28)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#6b5230',
              textDecoration: 'none',
            }}
          >
            View Residence
          </Link>
        </div>
      </div>

      {/* Auth dialog */}
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent style={{ border: '1px solid rgba(200,169,110,0.25)', background: '#fffdf8', fontFamily: "'DM Sans', sans-serif" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 22, color: '#1a1410' }}>
              Sign in to save favourites
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#7b6a4d', fontSize: 13 }}>
              You need to sign in before adding this property to your favourites list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => { setShowAuthDialog(false); setPendingFavoriteId(null); }}
              style={{ borderColor: 'rgba(200,169,110,0.35)', color: '#6b5636', background: 'transparent' }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/login")}
              style={{ background: 'linear-gradient(135deg,#c8a96e,#e8d4a8)', color: '#3d2c0e', border: 'none' }}
            >
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PropertyCard;  