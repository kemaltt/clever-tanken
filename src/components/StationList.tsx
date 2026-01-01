"use client";

import { TankerKoenigStation } from "@/lib/tankerkoenig";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";

interface StationListProps {
  stations: TankerKoenigStation[];
  searchParams: { q?: string; type?: string; r?: string };
}

export function StationList({ stations, searchParams }: StationListProps) {
  if (stations.length === 0) {
    return (
      <div className="py-10 text-center text-white">
        <p className="text-xl">Keine Tankstellen gefunden.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-20">
      {/* Results Header */}
      <div className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-white">
          {stations.length} {stations.length === 1 ? "Tankstelle" : "Tankstellen"} gefunden
        </h2>
        <span className="text-sm text-white/70">
          Sortiert nach Preis
        </span>
      </div>

      {stations.map((station) => (
        <div
          key={station.id}
          className="relative flex items-stretch overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.01]"
        >
          <Link
            href={`/?q=${searchParams.q}&type=${searchParams.type}&r=${searchParams.r}&id=${station.id}`}
            scroll={false}
            className="flex flex-1 items-stretch"
          >
            {/* Price Section */}
            <div className="flex w-32 flex-col items-center justify-center bg-gray-50 p-4 text-[#003050]">
              <div className="flex items-start">
                <span className="text-4xl font-bold leading-none">
                  {Math.floor(station.price)}.{Math.floor((station.price % 1) * 100)}
                </span>
                <span className="mt-1 text-xl font-bold leading-none">
                  {Math.floor((station.price * 1000) % 10)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                geändert
                <br />
                vor kurzem
              </div>
            </div>

            {/* MTS-K Badge Section */}
            <div className="flex w-24 flex-col items-center justify-center bg-[#8FB0C2] p-2 text-white">
               <div className="text-center text-xs font-bold">Preis von<br/>MTS-K</div>
            </div>

            {/* Info Section */}
            <div className="flex flex-1 flex-col justify-center p-4">
              <h3 className="text-xl font-bold text-[#003050]">{station.brand || station.name}</h3>
              <div className="text-sm text-gray-600">
                {station.street} {station.houseNumber}
              </div>
              <div className="text-sm text-gray-600">
                {station.postCode} {station.place}
              </div>
            </div>

            {/* Distance Section */}
            <div className="flex w-24 flex-col items-center justify-center p-4 text-[#003050]">
              <div className="text-xl font-bold">{station.dist.toFixed(1)} km</div>
            </div>
          </Link>

          {/* Favorite Button */}
          <div className="flex items-center pr-4">
            <FavoriteButton stationId={station.id} station={station} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

