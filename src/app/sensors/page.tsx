'use client';

import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Thermometer, Bell, WifiOff, Signal, ThermometerSnowflake, ThermometerSun, AreaChart, Filter } from 'lucide-react'; // Icons

// --- Data Structures & Dummy Data ---
type SensorStatus = 'Normal' | 'Alert' | 'Offline';
type SensorType = 'Freezer' | 'Fridge' | 'Ambient' | 'Probe' | 'Other';

interface SensorData {
  id: string;
  name: string;
  location: string; // e.g., "Boston Site A - Kitchen"
  type: SensorType;
  status: SensorStatus;
  currentTempCelsius?: number;
  lastUpdated: string; // e.g., "just now", "5 minutes ago"
  batteryLevel?: number; // Optional: percentage
}

const sensors: SensorData[] = [
  { id: 'sen001', name: 'Walk-in Freezer', location: 'Boston Site A - Kitchen', type: 'Freezer', status: 'Alert', currentTempCelsius: -15.8, lastUpdated: '6 minutes ago', batteryLevel: 85 },
  { id: 'sen002', name: 'Produce Fridge 1', location: 'Boston Site A - Prep Area', type: 'Fridge', status: 'Normal', currentTempCelsius: 2.5, lastUpdated: '8 minutes ago', batteryLevel: 92 },
  { id: 'sen003', name: 'Ambient Back Room', location: 'Toronto Clinic - Storage', type: 'Ambient', status: 'Normal', currentTempCelsius: 23.3, lastUpdated: 'just now' },
  { id: 'sen004', name: 'Vaccine Fridge', location: 'Toronto Clinic - Lab', type: 'Fridge', status: 'Normal', currentTempCelsius: 4.1, lastUpdated: '2 minutes ago', batteryLevel: 78 },
  { id: 'sen005', name: 'Meat Freezer', location: 'Miami Warehouse - Section C', type: 'Freezer', status: 'Offline', lastUpdated: '1 hour ago', batteryLevel: 10 },
  { id: 'sen006', name: 'Dairy Fridge', location: 'London Hub - Cafe', type: 'Fridge', status: 'Alert', currentTempCelsius: 8.9, lastUpdated: '15 minutes ago', batteryLevel: 65 },
  { id: 'sen007', name: 'Temperature Probe 1', location: 'Boston Site A - Loading Dock', type: 'Probe', status: 'Normal', currentTempCelsius: 20.6, lastUpdated: '10 minutes ago' },
  { id: 'sen008', name: 'Ambient Temperature Room', location: 'Miami Warehouse - Office', type: 'Ambient', status: 'Alert', currentTempCelsius: 28.1, lastUpdated: '5 minutes ago' },
  { id: 'sen009', name: 'Freezer Sensor B', location: 'Tokyo Center - Storage 2', type: 'Freezer', status: 'Normal', currentTempCelsius: -22.5, lastUpdated: '12 minutes ago', batteryLevel: 95 },
];

// --- Sensor Card Component ---
interface SensorCardProps {
  sensor: SensorData;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const isAlert = sensor.status === 'Alert';
  const isOffline = sensor.status === 'Offline';
  const isNormal = sensor.status === 'Normal';

  const cardBgColor = isAlert || isOffline ? 'bg-red-500' : 'bg-green-500';
  const textColor = 'text-white'; // White text for better contrast on colored backgrounds
  const iconColor = 'text-white';

  let IconComponent = Thermometer;
  if (sensor.type === 'Freezer') IconComponent = ThermometerSnowflake;
  if (sensor.type === 'Fridge') IconComponent = ThermometerSun; // Using Sun for Fridge as alternative

  return (
    <Card className={`overflow-hidden ${cardBgColor} ${textColor} shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className={`text-base font-semibold flex items-center ${textColor}`}>
             <IconComponent className={`w-4 h-4 mr-1.5 ${iconColor}`} />
            {sensor.name}
          </CardTitle>
          {/* Status Icon */} 
           {isAlert && <Bell className={`w-5 h-5 ${iconColor}`} />}
           {isOffline && <WifiOff className={`w-5 h-5 ${iconColor}`} />}
           {isNormal && <Signal className={`w-5 h-5 ${iconColor} opacity-70`} />} 
        </div>
        <CardDescription className={`text-xs ${textColor} opacity-90 pt-1`}> 
           {sensor.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {sensor.currentTempCelsius !== undefined ? (
            <div className={`text-3xl font-bold ${textColor}`}> 
             {sensor.currentTempCelsius.toFixed(1)}°C
            </div>
        ) : (
             <div className={`text-lg font-semibold ${textColor} pt-2`}> 
                Offline
            </div>
        )}
        <p className={`text-xs ${textColor} opacity-90 mt-1`}>{sensor.lastUpdated}</p>
         {/* Optional Battery Indicator */}
         {sensor.batteryLevel !== undefined && (
            <div className="text-xs mt-2 opacity-80">Batt: {sensor.batteryLevel}%</div>
         )}
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---
export default function SensorsPage() {
  // Basic state for filtering (expand later)
  const [filterType, setFilterType] = useState<SensorType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<SensorStatus | 'All'>('All');

  const filteredSensors = sensors.filter(sensor => {
    const typeMatch = filterType === 'All' || sensor.type === filterType;
    const statusMatch = filterStatus === 'All' || sensor.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Signal className="w-6 h-6 mr-2" /> Sensor Status
        </h1>
         {/* Filtering Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as SensorType | 'All')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Freezer">Freezer</SelectItem>
                <SelectItem value="Fridge">Fridge</SelectItem>
                <SelectItem value="Ambient">Ambient</SelectItem>
                <SelectItem value="Probe">Probe</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SensorStatus | 'All')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Alert">Alert</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
             <Button variant="outline"><Filter className="w-4 h-4 mr-1.5"/>More Filters</Button> {/* Placeholder */}
          </div>
      </div>

      {/* Sensor Grid */} 
      {filteredSensors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      ) : (
         <p className="text-muted-foreground text-center py-8">No sensors match the current filters.</p>
      )}

      <Separator />

      {/* Placeholder for Chart Section */}
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
             <AreaChart className="w-5 h-5 mr-2"/> Sensor Trends
            </CardTitle>
          <CardDescription>Summary chart of sensor readings over time.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-center text-muted-foreground py-12">Chart component will be displayed here.</p>
        </CardContent>
      </Card>

    </div>
  );
} 