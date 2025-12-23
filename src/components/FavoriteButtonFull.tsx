"use client";

import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";

interface FavoriteButtonFullProps {
  stationId: string;
}

export function FavoriteButtonFull({ stationId }: FavoriteButtonFullProps) {
  const { data: session } = useSession();
  const { openSidebar } = useSidebar();

  const handleFavoriteClick = () => {
    if (!session) {
      openSidebar();
      return;
    }

    // TODO: Add to favorites logic
    console.log("Add to favorites:", stationId);
  };

  return (
    <button 
      onClick={handleFavoriteClick}
      className="flex w-full items-center justify-center gap-2 rounded bg-[#4FA6E0] py-3 font-medium text-white transition-colors hover:bg-[#0078BE]"
    >
      <Star className="h-5 w-5" />
      <span>{session ? "Zu Favoriten hinzufügen" : "Einloggen um hinzuzufügen"}</span>
    </button>
  );
}
