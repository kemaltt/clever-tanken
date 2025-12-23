"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Station {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  price: number;
  street: string;
  place: string;
}

interface MapProps {
  stations: Station[];
  center?: [number, number];
  zoom?: number;
}

export default function Map({ stations, center = [51.1657, 10.4515], zoom = 6 }: MapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => (
        <Marker key={station.id} position={[station.lat, station.lng]}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">{station.brand} - {station.name}</h3>
              <p className="text-sm">{station.street}, {station.place}</p>
              <p className="mt-2 font-bold text-primary text-lg">{station.price.toFixed(2)} €</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
