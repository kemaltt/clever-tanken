"use client";

import { X, Search, Star, Trash2, MapPin, Fuel } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState, useEffect } from "react";
import { getFavorites, toggleFavorite } from "@/actions/favorites";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function FavoritesPanel() {
  const { isFavoritesOpen, closeFavorites, inputRef } = useFavorites();
  const { data: session } = useSession();
  const { openSidebar } = useSidebar();
  const router = useRouter();
  const t = useTranslations('FavoritesPanel');
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isFavoritesOpen && session) {
      loadFavorites();
    }
  }, [isFavoritesOpen, session]);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setLoading(false);
  };

  const handleRemoveFavorite = async (stationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    setFavorites(prev => prev.filter(f => f.stationId !== stationId));
    
    await toggleFavorite(stationId);
    toast.success(t('removed'));
  };

  const filteredFavorites = favorites.filter(fav => {
    if (!fav.station) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      fav.station.name.toLowerCase().includes(searchLower) ||
      fav.station.brand?.toLowerCase().includes(searchLower) ||
      fav.station.street?.toLowerCase().includes(searchLower) ||
      fav.station.place.toLowerCase().includes(searchLower)
    );
  });

  const handleLoginClick = () => {
    closeFavorites();
    openSidebar();
  };

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
              <h2 className="text-xl font-bold text-[#003050]">{t('title')}</h2>
            </div>
            <button
              onClick={closeFavorites}
              className="text-[#0078BE] hover:text-[#006098]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!session ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-[#0078BE]/10 p-4">
                <Star className="h-8 w-8 text-[#0078BE]" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">{t('loginRequired')}</h3>
              <p className="mb-6 text-sm text-gray-500">
                {t('loginDescription')}
              </p>
              <button
                onClick={handleLoginClick}
                className="rounded-lg bg-[#0078BE] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006098]"
              >
                {t('loginButton')}
              </button>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="relative mb-6">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-[#0078BE] focus:outline-none focus:ring-2 focus:ring-[#0078BE]/20"
                />
              </div>

              {/* Favorites List */}
              <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 animate-pulse rounded-lg bg-white shadow-sm" />
                    ))}
                  </div>
                ) : filteredFavorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <Star className="mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-sm">{t('noFavorites')}</p>
                    {searchTerm ? (
                      <p className="mt-1 text-xs">{t('tryDifferent')}</p>
                    ) : (
                      <p className="mt-1 text-xs">{t('addFavorites')}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredFavorites.map((fav) => (
                      <Link
                        key={fav.id}
                        href={`/?q=${encodeURIComponent(fav.station.postCode + " " + fav.station.place)}&type=diesel&r=5&id=${fav.station.id}`}
                        onClick={closeFavorites}
                        className="group relative flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-[#0078BE]/30"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-[#003050] line-clamp-1">
                            {fav.station.brand || fav.station.name}
                          </h3>
                          <button
                            onClick={(e) => handleRemoveFavorite(fav.stationId, e)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                            title={t('remove')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">
                            {fav.station.street} {fav.station.houseNumber}, {fav.station.postCode} {fav.station.place}
                          </span>
                        </div>

                        <div className={`mt-2 flex items-center gap-2 text-xs font-medium ${fav.station.isOpen ? "text-green-600" : "text-red-600"}`}>
                          <div className={`h-2 w-2 rounded-full ${fav.station.isOpen ? "bg-green-500" : "bg-red-500"}`} />
                          {fav.station.isOpen ? t('open') : t('closed')}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

