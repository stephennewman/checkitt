"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
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
import {
  AlertTriangle, // Warning
  AlertCircle, // Info/Warning
  CheckCircle, // Healthy
  MapPin, // Location
  Clock, // Time
} from "lucide-react";
import type { LatLngExpression } from 'leaflet';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapDisplay = dynamic(() => import('@/components/map-display'), {
  ssr: false,
});

// --- Data Types ---
interface GlobalOverviewData {
  region: string;
  locationsMonitored: number;
  totalAssets: number;
  healthy: number;
  warning: number;
  critical: number;
  failuresPrevented: number;
}

interface VendorPerformanceData {
  brand: string;
  totalAssets: number;
  avgHealthScore: number; // e.g., 0-100
  failureRate: number; // percentage
  avgTempDeviation: number; // +/- degrees
  costEfficiency: string; // e.g., "High", "Medium", "Low"
}

type AnomalyStatus = "Critical" | "Warning";
interface AnomalyData {
  time: string;
  location: string;
  assetId: string;
  issue: string;
  status: AnomalyStatus;
  actionTaken: string;
}

// Map location data type (must match definition in MapDisplay)
interface MapLocation {
  id: string;
  name: string;
  position: LatLngExpression;
  status: "Healthy" | "Warning" | "Critical";
  assetCount: number;
}

// --- Dummy Data ---

const globalOverview: GlobalOverviewData[] = [
  { region: "North America", locationsMonitored: 120, totalAssets: 1500, healthy: 1450, warning: 40, critical: 10, failuresPrevented: 25 },
  { region: "Europe", locationsMonitored: 180, totalAssets: 2200, healthy: 2100, warning: 75, critical: 25, failuresPrevented: 40 },
  { region: "Asia Pacific", locationsMonitored: 150, totalAssets: 1800, healthy: 1720, warning: 60, critical: 20, failuresPrevented: 30 },
  { region: "Latin America", locationsMonitored: 80, totalAssets: 900, healthy: 870, warning: 25, critical: 5, failuresPrevented: 10 },
  { region: "MEA", locationsMonitored: 50, totalAssets: 600, healthy: 580, warning: 15, critical: 5, failuresPrevented: 8 },
];

const vendorPerformance: VendorPerformanceData[] = [
  { brand: "FreezeMaster", totalAssets: 1500, avgHealthScore: 92, failureRate: 1.5, avgTempDeviation: 0.8, costEfficiency: "High" },
  { brand: "ChillWell", totalAssets: 1200, avgHealthScore: 88, failureRate: 2.1, avgTempDeviation: 1.1, costEfficiency: "Medium" },
  { brand: "ArcticFlow", totalAssets: 2000, avgHealthScore: 95, failureRate: 1.1, avgTempDeviation: 0.6, costEfficiency: "High" },
  { brand: "KoolKing", totalAssets: 800, avgHealthScore: 85, failureRate: 3.0, avgTempDeviation: 1.5, costEfficiency: "Low" },
  { brand: "SubZero Pro", totalAssets: 1000, avgHealthScore: 90, failureRate: 1.8, avgTempDeviation: 0.9, costEfficiency: "Medium" },
];

const anomalies: AnomalyData[] = [
  { time: "10:32 AM", location: "London - Warehouse A", assetId: "FRG-LON-A012", issue: "Temp above threshold (6°C)", status: "Warning", actionTaken: "Alert Sent" },
  { time: "10:28 AM", location: "New York - Store 3", assetId: "FRZ-NYC-S301", issue: "Compressor cycle irregular", status: "Warning", actionTaken: "Pending Review" },
  { time: "10:15 AM", location: "Tokyo - Central Hub", assetId: "FRG-TOK-C005", issue: "Door open > 10 min", status: "Warning", actionTaken: "Auto-Alert Staff" },
  { time: "09:55 AM", location: "Paris - Distribution C", assetId: "FRZ-PAR-D002", issue: "High failure probability (>90%)", status: "Critical", actionTaken: "Dispatch Scheduled" },
  { time: "09:40 AM", location: "Sydney - Retail East", assetId: "FRG-SYD-E007", issue: "Temp below threshold (-1°C)", status: "Warning", actionTaken: "Alert Sent" },
  { time: "09:30 AM", location: "New York - Store 3", assetId: "FRG-NYC-S304", issue: "Temp fluctuations detected", status: "Warning", actionTaken: "Monitoring" },
];

const mapLocations: MapLocation[] = [
  { id: "loc1", name: "London Hub", position: [51.5074, -0.1278], status: "Warning", assetCount: 150 },
  { id: "loc2", name: "New York DC", position: [40.7128, -74.0060], status: "Critical", assetCount: 210 },
  { id: "loc3", name: "Tokyo Office", position: [35.6895, 139.6917], status: "Healthy", assetCount: 95 },
  { id: "loc4", name: "Paris Store", position: [48.8566, 2.3522], status: "Healthy", assetCount: 80 },
  { id: "loc5", name: "Sydney Warehouse", position: [-33.8688, 151.2093], status: "Warning", assetCount: 120 },
  { id: "loc6", name: "São Paulo Hub", position: [-23.5505, -46.6333], status: "Healthy", assetCount: 70 },
  // Add more locations as needed
];

// --- Helper Functions ---

const getAnomalyIcon = (status: AnomalyStatus) => {
  switch (status) {
    case "Critical": return <AlertTriangle className="h-4 w-4 text-red-500 inline mr-1" />;
    case "Warning": return <AlertCircle className="h-4 w-4 text-yellow-500 inline mr-1" />;
    // case "Healthy": return <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />;
    default: return null;
  }
};

const getAnomalyBadgeVariant = (status: AnomalyStatus): "destructive" | "secondary" | "default" | "outline" => {
    switch (status) {
        case "Critical": return "destructive";
        case "Warning": return "secondary";
        default: return "outline";
    }
};

// --- Page Component ---

export default function AssetIntelligencePage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top Row: Overview + Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Global Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-center">Locations</TableHead>
                  <TableHead className="text-center">Assets</TableHead>
                  <TableHead className="text-center">🟢</TableHead>
                  <TableHead className="text-center">🟡</TableHead>
                  <TableHead className="text-center">🔴</TableHead>
                  <TableHead className="text-right">Failures Prevented</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {globalOverview.map((row) => (
                  <TableRow key={row.region}>
                    <TableCell className="font-medium">{row.region}</TableCell>
                    <TableCell className="text-center">{row.locationsMonitored}</TableCell>
                    <TableCell className="text-center">{row.totalAssets}</TableCell>
                    <TableCell className="text-center text-green-600">{row.healthy}</TableCell>
                    <TableCell className="text-center text-yellow-600">{row.warning}</TableCell>
                    <TableCell className="text-center text-red-600">{row.critical}</TableCell>
                    <TableCell className="text-right">{row.failuresPrevented}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top 5 Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-center">Assets</TableHead>
                  <TableHead className="text-center">Health Score</TableHead>
                  <TableHead className="text-center">Failure Rate</TableHead>
                  <TableHead className="text-right">Avg. Temp Dev.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorPerformance.map((row) => (
                  <TableRow key={row.brand}>
                    <TableCell className="font-medium">{row.brand}</TableCell>
                    <TableCell className="text-center">{row.totalAssets}</TableCell>
                    <TableCell className="text-center">{row.avgHealthScore}</TableCell>
                    <TableCell className="text-center">{row.failureRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">±{row.avgTempDeviation.toFixed(1)}°C</TableCell>
                    {/* <TableCell>{row.costEfficiency}</TableCell> */} 
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Anomalies + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-1 h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>Live Feed of Anomalies</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <Table>
              {/* <TableHeader> 
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader> */} 
              <TableBody>
                {anomalies.map((anomaly, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-[60px] text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{anomaly.time}</TableCell>
                    <TableCell className="text-xs"><MapPin className="h-3 w-3 inline mr-1" />{anomaly.location} ({anomaly.assetId})</TableCell>
                    <TableCell className="text-xs">{anomaly.issue}</TableCell>
                    <TableCell className="w-[100px] text-right">
                      <Badge variant={getAnomalyBadgeVariant(anomaly.status)} className="text-xs">
                        {getAnomalyIcon(anomaly.status)}
                        {anomaly.status}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>{anomaly.actionTaken}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-1 h-[500px]">
          <CardHeader>
            <CardTitle>Global Asset Status Map</CardTitle>
          </CardHeader>
          {/* Ensure MapDisplay takes full height of its container */}
          <CardContent className="h-[calc(100%-4rem)] p-0"> 
             <MapDisplay locations={mapLocations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 