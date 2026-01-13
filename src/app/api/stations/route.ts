import { NextRequest, NextResponse } from "next/server";
import { getStations } from "@/lib/tankerkoenig";
import { geocodeAddress } from "@/lib/geocoding";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");

  let lat = parseFloat(searchParams.get("lat") || "52.5200");
  let lng = parseFloat(searchParams.get("lng") || "13.4050");

  // If a location string is provided, geocode it first
  if (location) {
    const geo = await geocodeAddress(location);
    if (geo) {
      lat = geo.lat;
      lng = geo.lon;
    } else {
      return NextResponse.json(
        { ok: false, message: "Location not found" },
        { status: 404 }
      );
    }
  }

  const rad = parseFloat(searchParams.get("rad") || "5");
  const type =
    (searchParams.get("type") as "e5" | "e10" | "diesel" | "all") || "diesel";
  const sort = (searchParams.get("sort") as "price" | "dist") || "price";

  try {
    const stations = await getStations(lat, lng, type, rad, sort);
    return NextResponse.json({ ok: true, stations, center: { lat, lng } });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to fetch stations" },
      { status: 500 }
    );
  }
}
