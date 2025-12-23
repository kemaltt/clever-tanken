"use client";

import { X, Search, Star } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

export function FavoritesPanel() {
  const { isFavoritesOpen, closeFavorites, inputRef } = useFavorites();

  return (
    <>
      {/* Overlay */}
      {isFavoritesOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeFavorites}
        />
      )}

      {/* Favorites Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-[#F5F7F9] shadow-2xl transition-transform duration-300 ease-in-out ${
          isFavoritesOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-[#0078BE]" />
              <h2 className="text-xl font-bold text-[#003050]">Favoriten</h2>
            </div>
            <button
              onClick={closeFavorites}
              className="text-[#0078BE] hover:text-[#006098]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Favoriten suchen..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-[#0078BE] focus:outline-none focus:ring-2 focus:ring-[#0078BE]/20"
            />
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <Star className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-sm">Keine Favoriten vorhanden</p>
              <p className="mt-1 text-xs">Fügen Sie Tankstellen zu Ihren Favoriten hinzu</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
