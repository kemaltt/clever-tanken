import { TankerKoenigStation } from "./tankerkoenig";

const BRANDS = ["Aral", "Shell", "Esso", "TotalEnergies", "JET", "Star", "HEM", "Avia"];
const STREETS = ["Hauptstraße", "Bahnhofstraße", "Dorfstraße", "Schulstraße", "Gartenstraße", "Bergstraße"];
const PLACES = ["Berlin", "München", "Hamburg", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig"];

// Simple seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export async function getMockStations(
  lat: number,
  lng: number,
  radius: number
): Promise<TankerKoenigStation[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Create a seed from the coordinates to ensure deterministic results for the same location
  let seed = lat + lng + radius;

  const count = Math.floor(seededRandom(seed) * 5) + 3; // Generate 3-8 stations
  const stations: TankerKoenigStation[] = [];

  for (let i = 0; i < count; i++) {
    seed += 1;
    // Random offset from center
    const latOffset = (seededRandom(seed) - 0.5) * 0.05;
    seed += 1;
    const lngOffset = (seededRandom(seed) - 0.5) * 0.05;
    
    seed += 1;
    const brandIndex = Math.floor(seededRandom(seed) * BRANDS.length);
    seed += 1;
    const streetIndex = Math.floor(seededRandom(seed) * STREETS.length);
    seed += 1;
    const placeIndex = Math.floor(seededRandom(seed) * PLACES.length);

    // Generate a stable ID based on the "random" properties
    const id = `mock-${Math.floor(lat * 100)}-${Math.floor(lng * 100)}-${i}`;

    stations.push({
      id: id,
      name: `${BRANDS[brandIndex]} Station`,
      brand: BRANDS[brandIndex],
      street: STREETS[streetIndex],
      houseNumber: `${Math.floor(seededRandom(seed + 1) * 100) + 1}`,
      postCode: `${Math.floor(seededRandom(seed + 2) * 90000) + 10000}`,
      place: PLACES[placeIndex],
      lat: lat + latOffset,
      lng: lng + lngOffset,
      dist: seededRandom(seed + 3) * radius,
      price: 1.60 + (seededRandom(seed + 4) * 0.30), // Price between 1.60 and 1.90
      isOpen: true,
    });
  }

  return stations.sort((a, b) => a.price - b.price);
}
