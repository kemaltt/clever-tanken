import { SearchForm } from "@/components/SearchForm";
import Image from "next/image";
import { Suspense } from "react";

import { StationList } from "@/components/StationList";
import { StationDetail } from "@/components/StationDetail";
import { geocodeAddress } from "@/lib/geocoding";
import { getStations } from "@/lib/tankerkoenig";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; r?: string; id?: string }>;
}) {
  const { q, type, r, id } = await searchParams;
  const fuelType = (type as "diesel" | "e5" | "e10") || "diesel";
  const radius = r ? parseInt(r) : 5;

  let stations: any[] = [];
  let selectedStation = null;

  if (q) {
    const coords = await geocodeAddress(q);
    if (coords) {
      stations = await getStations(coords.lat, coords.lon, "all", radius);
      
      if (id) {
        selectedStation = stations.find((s) => s.id === id);
      }
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Background Image covering the entire page */}
      <div className="fixed inset-0 -z-10">
         <Image 
           src="/hero-bg2.png" 
           alt="Background" 
           fill 
           className="object-cover brightness-75" 
           priority
         />
      </div>

      {/* Hero Section */}
      <div className={`relative flex flex-col items-center justify-center px-4 py-10 text-center transition-all duration-500 ${q ? 'min-h-[40vh]' : 'flex-1'}`}>
        <div className="relative z-10 w-full max-w-4xl">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-5xl">
            Jetzt günstig tanken!
          </h1>
          <h2 className="mb-10 text-xl font-medium text-gray-200 sm:text-2xl">
            Tankstellen in Deiner Umgebung finden
          </h2>
          
          <div className="flex justify-center">
            <Suspense fallback={<div className="h-14 w-full max-w-4xl animate-pulse rounded-lg bg-white/20" />}>
              <SearchForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Content Section (Results or Features) */}
      <div className="w-full bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto min-h-[50vh] px-4 py-8">
          {q ? (
            // Search Results Mode
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {selectedStation ? (
                <StationDetail station={selectedStation} searchParams={{ q, type, r }} />
              ) : (
                <StationList stations={stations} searchParams={{ q, type, r }} />
              )}
            </div>
          ) : (
            // Default Features Mode
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center py-12">
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="mb-4 text-3xl font-bold text-white">15k+</div>
                <div className="text-gray-200">Tankstellen</div>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="mb-4 text-3xl font-bold text-white">Live</div>
                <div className="text-gray-200">Preis-Updates</div>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="mb-4 text-3xl font-bold text-white">Gratis</div>
                <div className="text-gray-200">Nutzung</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
