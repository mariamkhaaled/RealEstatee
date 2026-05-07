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
  <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8 min-h-[calc(100vh-64px)] bg-[#faf9f7]">

      {/* Header */}
      <div className="mb-10 border-b border-black/10 pb-6">
        <h1
          className="text-4xl font-semibold text-[#1a1814]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Saved Properties
        </h1>

      </div>

      {/* Empty state */}
      {properties.length === 0 ? (
        <p className="text-center text-black/50 mt-16 font-[DM Sans]">
          No favorites yet
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="h-[420px] transition-all duration-500 hover:-translate-y-1"
            >
              <PropertyCard
                property={property}
                onFavoriteToggle={handleRemoveFavorite}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  </>
);
};

export default Favorites;