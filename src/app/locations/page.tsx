'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { MapPin, Circle } from 'lucide-react';

// --- Dummy Data ---
type LocationStatus = 'Operational' | 'Needs Attention' | 'Offline';

interface LocationData {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  status: LocationStatus;
  assets: number;
  openIssues: number;
}

const locations: LocationData[] = [
  { id: 'loc1', name: 'Boston Site A', coordinates: [42.3601, -71.0589], status: 'Operational', assets: 15, openIssues: 0 },
  { id: 'loc2', name: 'Toronto Clinic', coordinates: [43.6532, -79.3832], status: 'Operational', assets: 8, openIssues: 0 },
  { id: 'loc3', name: 'Miami Warehouse', coordinates: [25.7617, -80.1918], status: 'Needs Attention', assets: 25, openIssues: 2 },
  { id: 'loc4', name: 'London Hub', coordinates: [51.5074, -0.1278], status: 'Operational', assets: 12, openIssues: 0 },
  { id: 'loc5', name: 'Berlin Office', coordinates: [52.5200, 13.4050], status: 'Offline', assets: 5, openIssues: 1 },
  { id: 'loc6', name: 'Tokyo Center', coordinates: [35.6895, 139.6917], status: 'Needs Attention', assets: 18, openIssues: 3 },
];

// --- Dynamic Map Component ---
const MapComponent = dynamic(
  () => import('@/components/locations/map'), // Assuming we create a separate map component
  { 
    ssr: false, // Important: Load only on client side
    loading: () => <p>Loading map...</p> 
  }
);

// --- Main Page Component ---
export default function LocationsPage() {
  const getStatusColor = (status: LocationStatus) => {
    switch (status) {
      case 'Operational': return 'text-green-600';
      case 'Needs Attention': return 'text-yellow-600';
      case 'Offline': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(space.16))] ">
      {/* Adjusted height for full viewport minus header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <MapPin className="w-6 h-6 mr-2" /> Locations Overview
        </h1>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
        {/* Map Section */} 
        <div className="h-[50vh] lg:h-full w-full border-r border-border">
           <MapComponent locations={locations} />
        </div>

        {/* Table Section */} 
        <div className="h-[50vh] lg:h-full w-full overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Assets</TableHead>
                  <TableHead className="text-right">Open Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((loc) => (
                  <TableRow key={loc.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">{loc.name}</TableCell>
                    <TableCell>
                       <Badge 
                         variant={loc.status === 'Offline' ? 'destructive' : loc.status === 'Needs Attention' ? 'secondary' : 'default'}
                         className={`capitalize ${getStatusColor(loc.status)} border-none px-2 py-0.5 text-xs bg-opacity-20`}
                       >
                         <Circle className={`w-2 h-2 mr-1 fill-current ${getStatusColor(loc.status)}`} />
                         {loc.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">{loc.assets}</TableCell>
                    <TableCell className="text-right">{loc.openIssues}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
} 