import { getMockStations } from "./mock-tankerkoenig";

const API_KEY = process.env.TANKERKOENIG_API_KEY;
const BASE_URL = "https://creativecommons.tankerkoenig.de/json/list.php";

export interface TankerKoenigStation {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  lat: number;
  lng: number;
  dist: number;
  price: number;
  diesel?: number;
  e5?: number;
  e10?: number;
  isOpen: boolean;
  houseNumber: string;
  postCode: string;
}

export async function getStations(
  lat: number,
  lng: number,
  type: "e5" | "e10" | "diesel" | "all" = "diesel",
  rad: number = 5,
  sort: "price" | "dist" = "price"
): Promise<TankerKoenigStation[]> {
  // Use Mock Service if no API Key is provided
  if (!API_KEY) {
    console.error("No API Key found!");
    throw new Error("API Key is missing");
    // console.log("No API Key found. Using Mock Data Service.");
    // return getMockStations(lat, lng, rad);
  }

  try {
    // API requirement: if type is 'all', sort must be 'dist'
    const apiSort = type === "all" ? "dist" : sort;
    const url = `${BASE_URL}?lat=${lat}&lng=${lng}&rad=${rad}&sort=${apiSort}&type=${type}&apikey=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes

    if (!response.ok) {
      throw new Error(`TankerKoenig API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.ok) {
        // Fallback to mock if API limit reached or other API error
        console.error("TankerKoenig API returned error:", data.message);
        throw new Error(data.message);
    }

    let stations = data.stations.map((station: any) => ({
      id: station.id,
      name: station.name,
      brand: station.brand,
      street: station.street,
      place: station.place,
      lat: station.lat,
      lng: station.lng,
      dist: station.dist,
      price: station.price ?? station[type === "all" ? "diesel" : type], // Fallback for sorting/display if needed
      diesel: station.diesel,
      e5: station.e5,
      e10: station.e10,
      isOpen: station.isOpen,
      houseNumber: station.houseNumber,
      postCode: station.postCode,
    }));

    // Manually sort by price if type was 'all' and sort was 'price' (since API forced 'dist')
    if (type === "all" && sort === "price") {
      stations.sort((a: TankerKoenigStation, b: TankerKoenigStation) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }

    return stations;
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    throw error;
    // Fallback to mock on network error
    // return getMockStations(lat, lng, rad);
  }
}
