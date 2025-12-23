"use client";

import dynamic from "next/dynamic";
import { TankerKoenigStation } from "@/lib/tankerkoenig";

const MapWrapper = dynamic(() => import("@/components/MapWrapper"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200" />,
});

export function StationMap({ station }: { station: TankerKoenigStation }) {
  return <MapWrapper stations={[station]} center={[station.lat, station.lng]} zoom={15} />;
}
