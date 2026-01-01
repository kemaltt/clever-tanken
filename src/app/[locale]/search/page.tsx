import dynamic from "next/dynamic";
import { SearchForm } from "@/components/SearchForm";
import MapWrapper from "@/components/MapWrapper";
import { geocodeAddress } from "@/lib/geocoding";
import { getStations } from "@/lib/tankerkoenig";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; r?: string }>;
}) {
  const { q, type, r } = await searchParams;
  const fuelType = (type as "diesel" | "e5" | "e10") || "diesel";
  const radius = r ? parseInt(r) : 5;
  
  let stations: any[] = [];
  let center: [number, number] = [51.1657, 10.4515]; // Default to Germany center
  let zoom = 6;

  if (q) {
    const coords = await geocodeAddress(q);
    if (coords) {
      center = [coords.lat, coords.lon];
      zoom = 13;
      stations = await getStations(coords.lat, coords.lon, fuelType, radius);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchForm />
        </Suspense>
      </div>

      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List View */}
        <div className="overflow-y-auto rounded-xl bg-card p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-xl font-bold">Results for "{q || "All"}"</h2>
          <div className="space-y-4">
            {stations.length === 0 && q && (
               <div className="text-muted-foreground">No stations found or invalid location.</div>
            )}
            {stations.map((station) => (
              <div key={station.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                <div>
                  <div className="font-bold text-lg">{station.brand}</div>
                  <div className="text-sm text-muted-foreground">{station.street} {station.houseNumber}</div>
                  <div className="text-sm text-muted-foreground">{station.postCode} {station.place}</div>
                  {station.isOpen ? (
                    <span className="text-xs font-medium text-green-600">Open</span>
                  ) : (
                    <span className="text-xs font-medium text-red-600">Closed</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{station.price.toFixed(2)} <span className="text-sm font-normal">€</span></div>
                  <div className="text-xs text-muted-foreground uppercase">{fuelType}</div>
                  <div className="text-xs text-muted-foreground">{station.dist} km</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="h-[400px] overflow-hidden rounded-xl shadow-sm lg:col-span-2 lg:h-full">
          <MapWrapper stations={stations} center={center} zoom={zoom} />
        </div>
      </div>
    </div>
  );
}
