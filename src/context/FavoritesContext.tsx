"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  hasLoaded: boolean;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (bookId: string) => Promise<{
    isFavorite?: boolean;
    requiresLogin?: boolean;
    message: string;
    ok: boolean;
  }>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");

        if (res.ok) {
          const data: { id: string }[] = await res.json();
          setFavoriteIds(new Set(data.map((book) => book.id)));
        } else {
          setFavoriteIds(new Set());
        }
      } catch {
        setFavoriteIds(new Set());
      } finally {
        setHasLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  const value = useMemo<FavoritesContextValue>(() => ({
    favoriteIds,
    hasLoaded,
    isFavorite: (bookId: string) => favoriteIds.has(bookId),
    toggleFavorite: async (bookId: string) => {
      const wasFavorite = favoriteIds.has(bookId);

      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId }),
        });

        if (res.status === 401) {
          return {
            requiresLogin: true,
            message: "Please login once to save favorites.",
            ok: false,
          };
        }

        setFavoriteIds((current) => {
          const next = new Set(current);
          if (wasFavorite) {
            next.delete(bookId);
          } else {
            next.add(bookId);
          }
          return next;
        });

        if (!res.ok) {
          setFavoriteIds((current) => {
            const next = new Set(current);
            if (wasFavorite) {
              next.add(bookId);
            } else {
              next.delete(bookId);
            }
            return next;
          });
          return {
            message: "Could not update favorite right now.",
            ok: false,
          };
        }

        const data: { isFavorite: boolean; message?: string } = await res.json();

        setFavoriteIds((current) => {
          const next = new Set(current);
          if (data.isFavorite) {
            next.add(bookId);
          } else {
            next.delete(bookId);
          }
          return next;
        });

        return {
          isFavorite: data.isFavorite,
          message: data.isFavorite ? "Favorite saved." : "Favorite removed.",
          ok: true,
        };
      } catch {
        setFavoriteIds((current) => {
          const next = new Set(current);
          if (wasFavorite) {
            next.add(bookId);
          } else {
            next.delete(bookId);
          }
          return next;
        });
        return {
          message: "Could not update favorite right now.",
          ok: false,
        };
      }
    },
  }), [favoriteIds, hasLoaded]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
