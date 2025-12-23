"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";

interface FavoritesContextType {
  isFavoritesOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  toggleFavorites: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFavorites = useCallback(() => {
    setIsFavoritesOpen(true);
    // Focus input after panel opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const closeFavorites = useCallback(() => {
    setIsFavoritesOpen(false);
  }, []);

  const toggleFavorites = useCallback(() => {
    setIsFavoritesOpen(prev => {
      if (!prev) {
        // Opening - focus input
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      return !prev;
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ isFavoritesOpen, openFavorites, closeFavorites, toggleFavorites, inputRef }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
