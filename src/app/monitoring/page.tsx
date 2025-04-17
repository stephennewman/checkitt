"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VChart } from "@visactor/react-vchart";
import type { VChartProps } from "@visactor/react-vchart";
import {
  Thermometer, // Temp
  ThermometerSnowflake, // Freezer
  ThermometerSun, // Fridge (or too warm)
  MapPin, // Location
  Clock, // Time
  CheckCircle, // In Range
  AlertTriangle, // At Risk/Out of Range
  Info, // Notes
  Filter, // Filter icon
  TrendingUp, // Temp rising
  TrendingDown, // Temp falling
} from "lucide-react";
import type { LatLngExpression } from 'leaflet';

// Dynamically import the Map component
const MapDisplay = dynamic(() => import('@/components/map-display'), {
  ssr: false,
});

// --- Data Types ---
type AssetType = "Freezer" | "Fridge";
type AssetStatus = "In Range" | "At Risk" | "Out of Range";

interface TemperatureReading {
  time: Date; // Use actual Date objects for easier sorting/charting
  temp: number;
}

interface AssetData {
  id: string;
  location: string;
  type: AssetType;
  currentTemp: number;
  status: AssetStatus;
  setpoint: [number, number]; // [min, max]
  deviation: number;
  lastUpdated: string; // Time string
  vendor: string;
  notes?: string;
  tempHistory?: TemperatureReading[]; // Optional: For detailed charts
  tempDrift?: number; // °C/hr, optional
}

// Map location data type (must match definition in MapDisplay)
interface MapLocation {
  id: string;
  name: string;
  position: LatLngExpression;
  status: "Healthy" | "Warning" | "Critical"; // MapDisplay expects these
  assetCount: number;
  inRangePercent?: number; // Add monitoring specific data
  avgDeviation?: number;
}

// --- Dummy Data ---

// Helper to generate history
const generateTempHistory = (baseTemp: number, hours: number): TemperatureReading[] => {
    const history: TemperatureReading[] = [];
    const now = new Date();
    for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000); 
        // Simulate some fluctuation
        const fluctuation = (Math.random() - 0.5) * 1.5;
        history.push({ time, temp: baseTemp + fluctuation });
    }
    // Add a more recent reading close to current temp
    history.push({ time: new Date(now.getTime() - 5*60*1000), temp: history[history.length-1]?.temp ?? baseTemp }) 
    return history;
};

const assets: AssetData[] = [
  { id: "FRZ-NYC-001", location: "NYC-WH1", type: "Freezer", currentTemp: -18.5, status: "In Range", setpoint: [-20, -16], deviation: -0.5, lastUpdated: "2m ago", vendor: "ArcticFlow", tempHistory: generateTempHistory(-18, 24), tempDrift: 0.1 },
  { id: "FRG-NYC-001", location: "NYC-WH1", type: "Fridge", currentTemp: 5.1, status: "At Risk", setpoint: [1, 4], deviation: 1.1, lastUpdated: "1m ago", vendor: "KoolKing", notes: "Slightly warm", tempHistory: generateTempHistory(4.5, 24), tempDrift: 0.8 },
  { id: "FRZ-LON-001", location: "LON-DC1", type: "Freezer", currentTemp: -15.2, status: "Out of Range", setpoint: [-20, -16], deviation: 0.8, lastUpdated: "5m ago", vendor: "FreezeMaster", notes: "Check door seal", tempHistory: generateTempHistory(-16, 24), tempDrift: 1.5 },
  { id: "FRG-LON-001", location: "LON-DC1", type: "Fridge", currentTemp: 2.5, status: "In Range", setpoint: [1, 4], deviation: -0.5, lastUpdated: "3m ago", vendor: "ChillWell", tempHistory: generateTempHistory(2.8, 24), tempDrift: -0.2 },
  { id: "FRZ-TOK-001", location: "TOK-WH2", type: "Freezer", currentTemp: -19.8, status: "In Range", setpoint: [-20, -16], deviation: -1.8, lastUpdated: "1m ago", vendor: "ArcticFlow", tempHistory: generateTempHistory(-19, 24), tempDrift: 0.0 },
  { id: "FRG-TOK-001", location: "TOK-WH2", type: "Fridge", currentTemp: 1.1, status: "In Range", setpoint: [1, 4], deviation: -1.9, lastUpdated: "4m ago", vendor: "FreezeMaster", tempHistory: generateTempHistory(1.5, 24), tempDrift: 0.1 },
  { id: "FRZ-SYD-001", location: "SYD-DC3", type: "Freezer", currentTemp: -17.0, status: "In Range", setpoint: [-20, -16], deviation: -1.0, lastUpdated: "2m ago", vendor: "SubZero Pro", tempHistory: generateTempHistory(-17.5, 24), tempDrift: -0.1 },
  { id: "FRG-SYD-001", location: "SYD-DC3", type: "Fridge", currentTemp: 6.5, status: "Out of Range", setpoint: [1, 4], deviation: 2.5, lastUpdated: "1m ago", vendor: "KoolKing", notes: "High temp alert active", tempHistory: generateTempHistory(5, 24), tempDrift: 2.0 },
];

// Aggregate data for map (simplified)
const mapLocations: MapLocation[] = [
    { id: "loc-nyc", name: "NYC-WH1", position: [40.7128, -74.0060], status: "Warning", assetCount: 2, inRangePercent: 50, avgDeviation: 0.3 },
    { id: "loc-lon", name: "LON-DC1", position: [51.5074, -0.1278], status: "Critical", assetCount: 2, inRangePercent: 50, avgDeviation: 0.15 },
    { id: "loc-tok", name: "TOK-WH2", position: [35.6895, 139.6917], status: "Healthy", assetCount: 2, inRangePercent: 100, avgDeviation: -1.85 },
    { id: "loc-syd", name: "SYD-DC3", position: [-33.8688, 151.2093], status: "Critical", assetCount: 2, inRangePercent: 50, avgDeviation: 0.75 },
];

// --- Helper Functions ---

const getStatusIcon = (status: AssetStatus) => {
  switch (status) {
    case "In Range": return <CheckCircle className="h-4 w-4 text-green-500 inline" />;
    case "At Risk": return <AlertTriangle className="h-4 w-4 text-yellow-500 inline" />;
    case "Out of Range": return <AlertTriangle className="h-4 w-4 text-red-500 inline" />;
    default: return null;
  }
};

const getStatusBadgeVariant = (status: AssetStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "In Range": return "default"; // Greenish
        case "At Risk": return "secondary"; // Yellowish
        case "Out of Range": return "destructive"; // Red
        default: return "outline";
    }
};

const getDeviationColor = (deviation: number, setpoint: [number, number]) => {
    const range = setpoint[1] - setpoint[0];
    const tolerance = range * 0.1; // Example: 10% tolerance within setpoint range for "At Risk"
    if (deviation > tolerance) return "text-red-500"; // Too warm
    if (deviation < -tolerance) return "text-blue-500"; // Too cold (for freezer, maybe okay for fridge)
    if (Math.abs(deviation) > 0) return "text-yellow-500"; // Within tolerance but not perfect
    return "text-green-500"; // Perfect
};

// --- Page Component ---

export default function MonitoringPage() {
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(assets[0] ?? null); // Select first asset initially
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");

  // Basic filtering logic (can be expanded)
  const filteredAssets = assets.filter(asset => 
      (locationFilter === "all" || asset.location === locationFilter) &&
      (statusFilter === "all" || asset.status === statusFilter) &&
      (vendorFilter === "all" || asset.vendor === vendorFilter)
  );

  // Chart Spec for Selected Asset
  const tempChartSpec: VChartProps['spec'] | null = selectedAsset?.tempHistory ? {
    type: 'line',
    data: [{ id: 'history', values: selectedAsset.tempHistory }],
    xField: 'time',
    yField: 'temp',
    seriesField: 'type', // To potentially add multiple lines later
    title: { visible: true, text: `Temperature Trend - ${selectedAsset.id} (${selectedAsset.location})` },
    axes: [
      { orient: 'bottom', type: 'time', title: { visible: false } },
      { orient: 'left', type: 'linear', title: { visible: true, text: 'Temp (°C)' } }
    ],
    tooltip: {
      visible: true,
    },
    // Add MarkLines for setpoint
    markLine: [
      {
        y: selectedAsset.setpoint[0],
        label: { text: `Min: ${selectedAsset.setpoint[0]}°C`, position: 'start', style: { fill: '#6b7280', textBaseline: 'bottom' } },
        line: { style: { stroke: '#6b7280', lineDash: [4, 4] } }
      },
      {
        y: selectedAsset.setpoint[1],
        label: { text: `Max: ${selectedAsset.setpoint[1]}°C`, position: 'start', style: { fill: '#6b7280', textBaseline: 'top' } },
        line: { style: { stroke: '#6b7280', lineDash: [4, 4] } }
      }
    ]
  } : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger><SelectValue placeholder="Filter by Location..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {[...new Set(assets.map(a => a.location))].map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Filter by Status..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="In Range">In Range</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
            <SelectItem value="Out of Range">Out of Range</SelectItem>
          </SelectContent>
        </Select>
         <Select value={vendorFilter} onValueChange={setVendorFilter}>
          <SelectTrigger><SelectValue placeholder="Filter by Vendor..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
             {[...new Set(assets.map(a => a.vendor))].map(vendor => (
                <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Add Asset Type filter if needed */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Table (Span 2) */}
        <Card className="lg:col-span-2 h-[600px] flex flex-col"> {/* Adjust height as needed */} 
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>Click row to view temperature trend.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto pr-2">
            <Table>{/* Removed stickyHeader and potential whitespace */} 
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Asset ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Current Temp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Deviation</TableHead>
                  <TableHead className="text-right">Drift (°C/hr)</TableHead>
                  <TableHead>Last Updated</TableHead>
                  {/* <TableHead>Vendor</TableHead> */}
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)} 
                    className={selectedAsset?.id === asset.id ? 'bg-muted/50 cursor-pointer' : 'cursor-pointer'}
                  >
                    <TableCell className="font-medium text-xs">{asset.id}</TableCell>
                    <TableCell className="text-xs">{asset.location}</TableCell>
                    <TableCell className="text-xs">{asset.type}</TableCell>
                    <TableCell className="text-right text-xs">{asset.currentTemp.toFixed(1)}°C</TableCell>
                    <TableCell className="text-xs">
                        <Badge variant={getStatusBadgeVariant(asset.status)} className="text-xs">
                            {getStatusIcon(asset.status)}
                            <span className="ml-1">{asset.status}</span>
                        </Badge>
                    </TableCell>
                    <TableCell className={`text-right text-xs ${getDeviationColor(asset.deviation, asset.setpoint)}`}>
                        {asset.deviation >= 0 ? '+' : ''}{asset.deviation.toFixed(1)}°C
                    </TableCell>
                     <TableCell className={`text-right text-xs ${asset.tempDrift && Math.abs(asset.tempDrift) > 0.5 ? (asset.tempDrift > 0 ? 'text-red-500' : 'text-blue-500') : 'text-muted-foreground'}`}>
                        {asset.tempDrift ? 
                         <span className='flex items-center justify-end'>
                            {asset.tempDrift > 0.1 ? <TrendingUp size={12} className='mr-0.5'/> : asset.tempDrift < -0.1 ? <TrendingDown size={12} className='mr-0.5'/> : '-'}
                            {asset.tempDrift.toFixed(1)}
                         </span> 
                         : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs">{asset.lastUpdated}</TableCell>
                    {/* <TableCell>{asset.vendor}</TableCell> */}
                    <TableCell className="text-xs">{asset.notes ? <Info size={14} /> : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column (Span 1): Map and Chart */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="h-[300px]"> 
             <CardHeader className="pb-2">
                <CardTitle>Location Overview</CardTitle>
             </CardHeader>
             <CardContent className="h-[calc(100%-3rem)] p-0"> 
                <MapDisplay locations={mapLocations} />
             </CardContent>
          </Card>
          
          <Card className="h-[300px]">
            <CardHeader className="pb-2">
                <CardTitle>Temperature Trend</CardTitle>
                <CardDescription>{selectedAsset ? `${selectedAsset.id}` : 'Select an asset from the table'}</CardDescription>
             </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]"> 
                {tempChartSpec ? (
                    <VChart spec={tempChartSpec} options={{ mode: "desktop-browser" }} />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No temperature history available or asset selected.
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
