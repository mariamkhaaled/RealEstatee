import React, { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await res.json();

        console.log("favorites:", data);

        // لو الـ backend بيرجع object فيه array
        setFavorites(data.favorites || data || []);

      } catch (error: any) {
        console.log(error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">

      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Saved Properties
        </h1>
        <p className="text-muted-foreground mt-2">
          Your personal collection of favorite homes.
        </p>
      </div>

      {favorites.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No favorites yet 💔
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;