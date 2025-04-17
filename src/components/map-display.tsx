"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

// Define map location data type
interface MapLocation {
  id: string;
  name: string;
  position: LatLngExpression;
  status: "Healthy" | "Warning" | "Critical";
  assetCount: number;
}

// Define custom icons (simple colored circles for this example)
const createCircleIcon = (color: string) => {
  return L.divIcon({
    html: `<span style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 50%; display: inline-block; border: 1px solid #FFF;"></span>`,
    className: "bg-transparent border-0", // Important to remove default Leaflet styles
    iconSize: [16, 16],
  });
};

const greenIcon = createCircleIcon("#22c55e"); // Green
const yellowIcon = createCircleIcon("#f97316"); // Orange
const redIcon = createCircleIcon("#ef4444");    // Red

// Map status to icon
const getIcon = (status: MapLocation["status"]) => {
  switch (status) {
    case "Healthy": return greenIcon;
    case "Warning": return yellowIcon;
    case "Critical": return redIcon;
    default: return greenIcon; // Default fallback
  }
};

interface MapDisplayProps {
  locations: MapLocation[];
  center?: LatLngExpression;
  zoom?: number;
}

export default function MapDisplay({ 
  locations,
  center = [20, 0], // Default center (adjust as needed)
  zoom = 2,         // Default zoom level
}: MapDisplayProps) {
  
  // Prevent server-side rendering issues with Leaflet
  if (typeof window === 'undefined') {
      return null;
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker key={location.id} position={location.position} icon={getIcon(location.status)}>
          <Popup>
            <b>{location.name}</b><br />
            Status: {location.status}<br />
            Assets: {location.assetCount}
            {/* TODO: Add more details or link for drill-down */}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 