import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types";
import { useFavorites } from "@/context/FavoritesContext";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds, loading } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // إذا لم يكن المستخدم مسجل دخول، توجيهه للتسجيل
    if (!token) {
      setProperties([]);
      navigate("/login");
      return;
    }

    const fetchFavoriteProperties = async () => {
      try {
        setIsLoading(true);

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

        // معالجة الاستجابة من الـ backend
        const favoritesList = data.favorites || data || [];
        setProperties(Array.isArray(favoritesList) ? favoritesList : []);
      } catch (error) {
        console.log(error);
        setError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    // جلب البيانات عند تحديث favoriteIds أو عند التحقق من التوثيق
    if (!loading) {
      fetchFavoriteProperties();
    }
  }, [loading, favoriteIds, navigate]);

  // حذف العقار من القائمة المحلية عند حذفه من المفضلات
  const handleRemoveFavorite = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  if (isLoading) {
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

      {properties.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No favorites yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onFavoriteToggle={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;