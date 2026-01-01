"use client";

import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/actions/favorites";
import type { TankerKoenigStation } from "@/lib/tankerkoenig";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface FavoriteButtonProps {
  stationId: string;
  station?: TankerKoenigStation;
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteButton({ stationId, station, size = "md", className = "" }: FavoriteButtonProps) {
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

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      // Open login sidebar without URL change
      openSidebar();
      return;
    }

    setLoading(true);
    const result = await toggleFavorite(stationId, station);
    
    if (result.success) {
      setFavorite(result.isFavorite ?? false);
      if (result.isFavorite) {
        toast.success(t('added'));
      } else {
        toast.success(t('removed'));
      }
    }
    setLoading(false);
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonPadding = size === "sm" ? "p-2" : "p-3";

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={loading}
      className={`rounded-full ${
        favorite 
          ? "bg-yellow-400 text-white hover:bg-yellow-500" 
          : "bg-[#4FA6E0] text-white hover:bg-[#0078BE]"
      } transition-colors ${buttonPadding} ${className} ${loading ? "opacity-50" : ""}`}
      title={session ? (favorite ? t('removeFromFavorites') : t('addToFavorites')) : t('loginToAdd')}
    >
      <Star className={`${iconSize} ${favorite ? "fill-current" : ""}`} />
    </button>
  );
}
