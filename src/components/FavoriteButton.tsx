"use client";

import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";

interface FavoriteButtonProps {
  stationId: string;
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteButton({ stationId, size = "md", className = "" }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const { openSidebar } = useSidebar();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      // Open login sidebar without URL change
      openSidebar();
      return;
    }

    // TODO: Add to favorites logic
    console.log("Add to favorites:", stationId);
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonPadding = size === "sm" ? "p-2" : "p-3";

  return (
    <button
      onClick={handleFavoriteClick}
      className={`rounded-full bg-[#4FA6E0] text-white transition-colors hover:bg-[#0078BE] ${buttonPadding} ${className}`}
      title={session ? "Zu Favoriten hinzufügen" : "Zum Hinzufügen bitte einloggen"}
    >
      <Star className={iconSize} />
    </button>
  );
}
