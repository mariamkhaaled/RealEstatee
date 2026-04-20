import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  clearFavorites: () => void;
  isFavorite: (propertyId: string) => boolean;
  loadFavorites: () => Promise<void>;
  loading: boolean;
  pendingFavoriteId: string | null;
  setPendingFavoriteId: (propertyId: string | null) => void;
  addPendingFavorite: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [pendingFavoriteId, setPendingFavoriteId] = useState<string | null>(null);

  // Load favorites from API on mount
  const loadFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/favorites', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        const favorites = data.favorites || data || [];
        const ids = new Set(
          Array.isArray(favorites) ? favorites.map((f: any) => f.id) : []
        );
        setFavoriteIds(ids);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback((propertyId: string) => {
    setFavoriteIds((prev) => new Set([...prev, propertyId]));
  }, []);

  const removeFavorite = useCallback((propertyId: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(propertyId);
      return newSet;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteIds(new Set());
    setPendingFavoriteId(null);
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds]
  );

  const addPendingFavorite = useCallback(async () => {
    if (!pendingFavoriteId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: pendingFavoriteId,
        }),
      });

      if (res.ok) {
        addFavorite(pendingFavoriteId);
        setPendingFavoriteId(null);
      }
    } catch (error) {
      console.error('Error adding pending favorite:', error);
    }
  }, [pendingFavoriteId, addFavorite]);

  const value: FavoritesContextType = {
    favoriteIds,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    loadFavorites,
    loading,
    pendingFavoriteId,
    setPendingFavoriteId,
    addPendingFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
