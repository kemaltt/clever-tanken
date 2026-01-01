"use client";

import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState, useEffect } from "react";
import type { TankerKoenigStation } from "@/lib/tankerkoenig";
import { toggleFavorite, isFavorite } from "@/actions/favorites";
import { useTranslations } from "next-intl";

interface FavoriteButtonFullProps {
  stationId: string;
  station?: TankerKoenigStation;
}

export function FavoriteButtonFull({ stationId, station }: FavoriteButtonFullProps) {
  const { data: session } = useSession();
  const { openSidebar } = useSidebar();
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('StationDetail');

  useEffect(() => {
    if (session) {
      isFavorite(stationId).then(setFavorite);
    }
  }, [session, stationId]);

  const handleFavoriteClick = async () => {
    if (!session) {
      openSidebar();
      return;
    }

    setLoading(true);
    const result = await toggleFavorite(stationId, station);
    
    if (result.success) {
      setFavorite(result.isFavorite ?? false);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleFavoriteClick}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-2 rounded py-3 font-medium text-white transition-colors ${
        favorite 
          ? "bg-yellow-400 hover:bg-yellow-500" 
          : "bg-[#4FA6E0] hover:bg-[#0078BE]"
      } ${loading ? "opacity-50" : ""}`}
    >
      <Star className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
      <span>
        {!session 
          ? t('loginToAdd') 
          : favorite 
            ? t('removeFromFavorites') 
            : t('addToFavorites')
        }
      </span>
    </button>
  );
}
