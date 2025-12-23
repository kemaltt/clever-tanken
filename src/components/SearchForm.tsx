"use client";

import { Search, MapPin, Star, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFavorites } from "@/contexts/FavoritesContext";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openFavorites } = useFavorites();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [fuelType, setFuelType] = useState(searchParams.get("type") || "diesel");
  const [radius, setRadius] = useState(searchParams.get("r") || "5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}&type=${fuelType}&r=${radius}`);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Main Search Bar */}
        <div className="relative flex h-14 w-full items-center overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="flex h-full w-14 items-center justify-center text-gray-400">
            <MapPin className="h-6 w-6" />
          </div>
          <input
            type="text"
            placeholder="PLZ und/oder Ort"
            className="h-full flex-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push("/");
              }}
              className="flex h-full w-10 items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            className="flex h-full w-16 items-center justify-center bg-[#0078BE] text-white transition-colors hover:bg-[#006098]"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap gap-4">
          {/* Fuel Type Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="h-12 w-full appearance-none rounded-lg bg-[#0078BE] px-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="diesel">Diesel</option>
              <option value="e10">Super E10</option>
              <option value="e5">Super E5</option>
              <option value="superplus">SuperPlus</option>
              <option value="premium_diesel">Premium Diesel</option>
              <option value="hvo_diesel">HVO Diesel</option>
              <option value="gtl_diesel">GTL-Diesel</option>
              <option value="lkw_diesel">LKW-Diesel</option>
              <option value="lpg">LPG</option>
              <option value="cng">CNG</option>
              <option value="lng">LNG</option>
              <option value="bioethanol">Bioethanol</option>
              <option value="adblue_pkw">AdBlue PKW</option>
              <option value="adblue_lkw">AdBlue LKW</option>
              <option value="wasserstoff">Wasserstoff</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </div>

          {/* Radius Dropdown */}
          <div className="relative min-w-[100px] flex-1 sm:flex-none">
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="h-12 w-full appearance-none rounded-lg bg-[#0078BE] px-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="1">1 km</option>
              <option value="2">2 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="15">15 km</option>
              <option value="20">20 km</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </div>

          {/* Spacer to push Favorites to right on large screens */}
          <div className="hidden flex-1 sm:block" />

          {/* Favorites Button */}
          <button
            type="button"
            onClick={openFavorites}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0078BE] px-6 font-medium text-white transition-colors hover:bg-[#006098] sm:flex-none"
          >
            <Star className="h-5 w-5" />
            <span>Favoriten</span>
          </button>
        </div>
      </form>
    </div>
  );
}
