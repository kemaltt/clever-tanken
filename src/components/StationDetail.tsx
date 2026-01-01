import { TankerKoenigStation } from "@/lib/tankerkoenig";
import { Star, X, Navigation } from "lucide-react";
import Link from "next/link";
import { StationMap } from "@/components/StationMap";
import { NavigationDropdown } from "@/components/NavigationDropdown";
import { FavoriteButtonFull } from "@/components/FavoriteButtonFull";

interface StationDetailProps {
  station: TankerKoenigStation;
  searchParams: { q?: string; type?: string; r?: string };
}

export function StationDetail({ station, searchParams }: StationDetailProps) {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
      {/* Header */}
      <div className="relative flex items-center justify-between bg-[#0078BE] p-4 text-white">
        <h2 className="text-2xl font-bold">{station.brand || station.name}</h2>
        <Link
          href={`/?q=${searchParams.q}&type=${searchParams.type}&r=${searchParams.r}`}
          scroll={false}
          className="rounded-full p-1 hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#003050]">Adresse</h3>
            <p className="text-lg text-gray-700">
              {station.street} {station.houseNumber}
            </p>
            <p className="text-lg font-bold text-[#003050]">
              {station.postCode} {station.place}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-bold text-[#003050]">Öffnungszeiten</h3>
            <div className="space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span>Samstag</span>
                <span>0:00-24:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sonntag</span>
                <span>0:00-24:00</span>
              </div>
              <div className="flex justify-between">
                <span>Mo-Fr</span>
                <span>0:00-24:00</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              * Öffnungszeiten können abweichen (Mock Data)
            </p>
          </div>

          <FavoriteButtonFull stationId={station.id} station={station} />

          <NavigationDropdown lat={station.lat} lng={station.lng} />
        </div>

        {/* Map Column */}
        <div className="h-64 overflow-hidden rounded-lg md:h-full">
          <StationMap station={station} />
        </div>
      </div>

      {/* Prices Section */}
      <div className="bg-[#003050] p-6 text-white">
        <h3 className="mb-6 text-xl font-bold">Aktuelle Preise</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div>
              <div className="text-lg font-bold">Diesel</div>
              <div className="text-xs text-gray-300">MTS-K Preis</div>
            </div>
            <div className="text-3xl font-mono font-bold">{station.diesel?.toFixed(3) ?? "-.---"} €</div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div>
              <div className="text-lg font-bold">Super E5</div>
              <div className="text-xs text-gray-300">MTS-K Preis</div>
            </div>
            <div className="text-3xl font-mono font-bold">{station.e5?.toFixed(3) ?? "-.---"} €</div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div>
              <div className="text-lg font-bold">Super E10</div>
              <div className="text-xs text-gray-300">MTS-K Preis</div>
            </div>
            <div className="text-3xl font-mono font-bold">{station.e10?.toFixed(3) ?? "-.---"} €</div>
          </div>
        </div>
      </div>
    </div>
  );
}
