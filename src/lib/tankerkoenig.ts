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
    const apiSort = type === "all" ? "dist" : sort;
    const url = `${BASE_URL}?lat=${lat}&lng=${lng}&rad=${rad}&sort=${apiSort}&type=${type}&apikey=${API_KEY}`;

    // Attempt real API call
    let response;
    try {
      response = await fetch(url, { next: { revalidate: 300 } });
    } catch (fetchError) {
      console.warn(
        "TankerKoenig fetch failed, using mock fallback:",
        fetchError
      );
      return getMockStations(lat, lng, rad);
    }

    if (!response.ok) {
      console.warn(
        `TankerKoenig API HTTP Error: ${response.status} ${response.statusText}. Using mock fallback.`
      );
      return getMockStations(lat, lng, rad);
    }

    const data = await response.json();

    if (!data.ok) {
      console.warn(
        "TankerKoenig API Business Error:",
        data.message,
        "Using mock fallback."
      );
      return getMockStations(lat, lng, rad);
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
      stations.sort(
        (a: TankerKoenigStation, b: TankerKoenigStation) =>
          (a.price ?? Infinity) - (b.price ?? Infinity)
      );
    }

    return stations;
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    throw error;
  }
}

export async function getStationDetail(id: string): Promise<any> {
  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  const DETAIL_URL = "https://creativecommons.tankerkoenig.de/json/detail.php";
  const url = `${DETAIL_URL}?id=${id}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 1 minute
    if (!response.ok) {
      console.error(
        `TankerKoenig Detail API HTTP Error: ${response.status} ${response.statusText} for ID: ${id}`
      );
      throw new Error(
        "İstasyon detay servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin."
      );
    }

    const data = await response.json();
    if (!data.ok) {
      console.error(
        "TankerKoenig Detail API Business Error:",
        data.message,
        "ID:",
        id
      );
      throw new Error(data.message || "İstasyon detayları bulunamadı.");
    }

    return data.station;
  } catch (error) {
    console.error("Failed to fetch station detail:", error);
    throw error;
  }
}
