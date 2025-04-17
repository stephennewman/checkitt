'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issue with Leaflet and Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

// --- Types (can be shared or imported) ---
type LocationStatus = 'Operational' | 'Needs Attention' | 'Offline';

interface LocationData {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  status: LocationStatus;
  assets: number;
  openIssues: number;
}

interface LocationMapProps {
  locations: LocationData[];
}

const LocationMap: React.FC<LocationMapProps> = ({ locations }) => {

  const getStatusColor = (status: LocationStatus): string => {
    switch (status) {
      case 'Operational': return '#16a34a'; // green-600
      case 'Needs Attention': return '#ca8a04'; // yellow-600
      case 'Offline': return '#dc2626'; // red-600
      default: return '#71717a'; // zinc-500
    }
  };

  if (typeof window === 'undefined') {
    // Avoid rendering on the server
    return null;
  }

  // Calculate center (simple average for now, could be more sophisticated)
  const centerLat = locations.reduce((sum, loc) => sum + loc.coordinates[0], 0) / locations.length;
  const centerLng = locations.reduce((sum, loc) => sum + loc.coordinates[1], 0) / locations.length;
  const mapCenter: [number, number] = [centerLat || 51.505, centerLng || -0.09]; // Default to London if no locations

  return (
    <MapContainer 
      center={mapCenter}
      zoom={2} // Start zoomed out
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%' }} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
         // Use CircleMarker for status indication instead of default icon 
         <CircleMarker
            key={loc.id}
            center={loc.coordinates}
            radius={8}
            pathOptions={{ 
                color: getStatusColor(loc.status),
                fillColor: getStatusColor(loc.status),
                fillOpacity: 0.8
            }}
          >
           <Popup>
              <b>{loc.name}</b><br />
              Status: {loc.status}<br />
              Assets: {loc.assets}<br />
              Issues: {loc.openIssues}
            </Popup>
         </CircleMarker>
        /* Or use default markers if preferred:
        <Marker key={loc.id} position={loc.coordinates}>
          <Popup>
            <b>{loc.name}</b><br />
            Status: {loc.status}<br />
            Assets: {loc.assets}<br />
            Issues: {loc.openIssues}
          </Popup>
        </Marker>
        */
      ))}
    </MapContainer>
  );
};

export default LocationMap; 