import { useState } from "react";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
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
  const fav = isFavorite(property.id);
  const navigate = useNavigate();

  const handleToggleFavorite = async () => {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        removeFavorite(property.id);
        // تنبيه الـ parent بأن العقار تم حذفه
        onFavoriteToggle?.(property.id);
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            property_id: property.id,
          }),
        });

        addFavorite(property.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-cmp="PropertyCard"
      className="bg-card rounded-xl overflow-hidden shadow-custom border border-border group transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={
            property.images?.[0]
              ? property.images[0].startsWith("http")
                ? property.images[0]
                : `http://localhost:5000${property.images[0]}`
              : "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant="secondary"
            className="bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-sm border-none"
          >
            For {property.purpose}
          </Badge>

          <Badge
            variant="outline"
            className="bg-card/90 backdrop-blur-sm text-foreground border-none"
          >
            {property.type}
          </Badge>
        </div>

        {/*TOGGLE BUTTON (ONLY PART MODIFIED) */}
        <button
          disabled={loading}
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <Heart
            size={18}
            className={fav ? "fill-destructive text-destructive" : ""}
          />
        </button>

        <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign in to save favorites</AlertDialogTitle>
              <AlertDialogDescription>
                You need to sign in before adding this property to your favorites list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowAuthDialog(false);
                  setPendingFavoriteId(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {property.title}
          </h3>

          <span className="text-lg font-bold text-primary whitespace-nowrap ml-3">
            ${property.price.toLocaleString()}
            {property.purpose === "Rent" && (
              <span className="text-sm text-muted-foreground font-normal">
                /mo
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-border">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Bed size={18} className="mb-1" />
            <span className="text-xs font-medium">
              {property.beds} Beds
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-muted-foreground border-x border-border">
            <Bath size={18} className="mb-1" />
            <span className="text-xs font-medium">
              {property.baths} Baths
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Square size={18} className="mb-1" />
            <span className="text-xs font-medium">
              {property.sqft} sqft
            </span>
          </div>
        </div>

        <Link to={`/property-details/${property.id}`}
          className="block w-full text-center py-2.5 mt-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;