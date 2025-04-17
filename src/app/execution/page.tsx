"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Clock, // Time
  MapPin, // Location
  User, // Assigned To
  ListChecks, // Scheduled
  BellRing, // Unscheduled
  ClipboardCheck, // Follow-up / Completed
  AlertTriangle, // Priority / Missed
  CheckCircle, // Completed On-Time
  Camera, // Documentation
  Brain, // Training
  TrendingUp, // Performance Trend Up
  TrendingDown, // Performance Trend Down
  Minus, // Performance Trend Neutral
  HelpCircle, // Help Content
} from "lucide-react";

// --- Data Types ---
type TaskType = "Scheduled" | "Unscheduled" | "Follow-Up";
type TaskStatus = "Pending" | "In Progress" | "Completed" | "Missed";
type Priority = "Low" | "Medium" | "High" | "Critical";

interface TaskEvent {
  id: string;
  time: string;
  location: string;
  assignedTo: string;
  taskType: TaskType;
  status: TaskStatus;
  priority: Priority;
  hasDocs?: boolean;
  needsTraining?: boolean;
  description?: string; // Short task description
}

interface RegionExecutionOverview {
  region: string;
  locations: number;
  totalTasksToday: number;
  completedOnTimePercent: number;
  missedTasks: number;
  followUpsCreated: number;
  performanceTrend: "up" | "down" | "neutral";
}

interface QualityData {
  docsSubmittedPercent: number;
  tasksMissingContext: number;
  tasksTriggeringFollowUp: number;
  tasksNeedingTraining: number;
}

interface TrainingData {
  usersNeedingCoaching: string[];
  helpContentAccessRate: number; // percentage
  topRetrainingAreas: string[];
}

// --- Dummy Data ---

const taskFeed: TaskEvent[] = [
  { id: 't1', time: '11:45', location: 'NYC-WH1', assignedTo: 'J. Doe', taskType: 'Unscheduled', status: 'In Progress', priority: 'Critical', description: 'Freezer FZ-03 Temp Alert', needsTraining: true },
  { id: 't2', time: '11:30', location: 'LON-ST5', assignedTo: 'A. Smith', taskType: 'Scheduled', status: 'Completed', priority: 'Medium', description: 'Daily Safety Check - Area B', hasDocs: true },
  { id: 't3', time: '11:15', location: 'TOK-DC2', assignedTo: 'K. Lee', taskType: 'Follow-Up', status: 'Pending', priority: 'High', description: 'Review spill cleanup procedure' },
  { id: 't4', time: '11:00', location: 'SYD-WH3', assignedTo: 'M. Chen', taskType: 'Scheduled', status: 'Missed', priority: 'Low', description: 'Weekly Sanitation Log - Zone 1' },
  { id: 't5', time: '10:55', location: 'PAR-ST1', assignedTo: 'L. Dubois', taskType: 'Unscheduled', status: 'Completed', priority: 'High', description: 'Safety Hazard Reported - Aisle 5', hasDocs: true },
  { id: 't6', time: '10:40', location: 'NYC-WH1', assignedTo: 'J. Doe', taskType: 'Scheduled', status: 'Completed', priority: 'Medium', description: 'Forklift Pre-use Inspection' },
];

const regionOverview: RegionExecutionOverview[] = [
  { region: 'NA', locations: 120, totalTasksToday: 4800, completedOnTimePercent: 92, missedTasks: 384, followUpsCreated: 120, performanceTrend: 'up' },
  { region: 'EU', locations: 180, totalTasksToday: 7200, completedOnTimePercent: 88, missedTasks: 864, followUpsCreated: 250, performanceTrend: 'down' },
  { region: 'APAC', locations: 150, totalTasksToday: 6000, completedOnTimePercent: 95, missedTasks: 300, followUpsCreated: 150, performanceTrend: 'up' },
  { region: 'LATAM', locations: 80, totalTasksToday: 3200, completedOnTimePercent: 91, missedTasks: 288, followUpsCreated: 80, performanceTrend: 'neutral' },
];

const qualityData: QualityData = {
  docsSubmittedPercent: 85,
  tasksMissingContext: 45,
  tasksTriggeringFollowUp: 112,
  tasksNeedingTraining: 78,
};

const trainingData: TrainingData = {
  usersNeedingCoaching: ['J. Doe (NYC-WH1)', 'M. Chen (SYD-WH3)', 'R. Kim (TOK-DC2)'],
  helpContentAccessRate: 15,
  topRetrainingAreas: ['Freezer Alert Response', 'Safety Check Documentation', 'Spill Cleanup Protocol'],
};

// --- Helper Functions ---

const getTaskTypeIcon = (type: TaskType) => {
  switch (type) {
    case "Scheduled": return <ListChecks className="h-4 w-4 text-blue-500" />;
    case "Unscheduled": return <BellRing className="h-4 w-4 text-yellow-500" />;
    case "Follow-Up": return <ClipboardCheck className="h-4 w-4 text-purple-500" />;
    default: return null;
  }
};

const getStatusBadgeVariant = (status: TaskStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "Completed": return "default"; // Greenish
        case "In Progress": return "secondary"; // Yellowish
        case "Pending": return "outline"; // Grey
        case "Missed": return "destructive"; // Red
        default: return "outline";
    }
};

const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
        case "Critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
        case "High": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
        // Medium/Low might not need an icon, or use a subtle one
        default: return null;
    }
};

const getTrendIcon = (trend: RegionExecutionOverview['performanceTrend']) => {
    switch (trend) {
        case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
        case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
        case "neutral": return <Minus className="h-4 w-4 text-gray-500" />;
        default: return null;
    }
}

// --- Page Component ---

export default function ExecutionPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (Span 2): Feed and Overview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Task Activity Feed */}
        <Card className="h-[400px] flex flex-col"> {/* Fixed height */} 
          <CardHeader>
            <CardTitle>Task Activity Feed</CardTitle>
            {/* TODO: Add real-time update indicator */}
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto pr-2"> {/* Scrollable content */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Task / Type</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="w-[150px]">Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskFeed.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-xs text-muted-foreground">{task.time}</TableCell>
                    <TableCell className="text-xs font-medium">{task.location}</TableCell>
                    <TableCell className="text-xs">{task.assignedTo}</TableCell>
                    <TableCell className="text-xs flex items-center space-x-1">
                        {getTaskTypeIcon(task.taskType)}
                        <span>{task.description ?? task.taskType}</span>
                    </TableCell>
                    <TableCell className="text-right">
                        <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                            {task.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1"/>}
                            {task.status === 'Missed' && <AlertTriangle className="h-3 w-3 mr-1"/>}
                            {task.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-xs flex space-x-1.5 items-center">
                        {getPriorityIcon(task.priority)}
                        {task.hasDocs && <Camera className="h-4 w-4 text-blue-500" />}
                        {task.needsTraining && <Brain className="h-4 w-4 text-purple-500" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Global Execution Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Global Execution Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-center">Locations</TableHead>
                  <TableHead className="text-center">Tasks (Today)</TableHead>
                  <TableHead className="text-center">Completed On-Time</TableHead>
                  <TableHead className="text-center">Missed</TableHead>
                  <TableHead className="text-center">Follow-Ups</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionOverview.map((region) => (
                  <TableRow key={region.region}>
                    <TableCell className="font-medium">{region.region}</TableCell>
                    <TableCell className="text-center">{region.locations}</TableCell>
                    <TableCell className="text-center">{region.totalTasksToday}</TableCell>
                    <TableCell className={`text-center ${region.completedOnTimePercent >= 90 ? 'text-green-600' : region.completedOnTimePercent >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {region.completedOnTimePercent}%
                    </TableCell>
                    <TableCell className="text-center">{region.missedTasks}</TableCell>
                    <TableCell className="text-center">{region.followUpsCreated}</TableCell>
                    <TableCell className="text-right">{getTrendIcon(region.performanceTrend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Right Column (Span 1): Calendar, Quality, Training */}
      <div className="lg:col-span-1 space-y-6">
        {/* Scheduled Task Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Task Calendar</CardTitle>
            <CardDescription>View recurring tasks. {/* TODO: Add Filters */}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-0"
            />
          </CardContent>
        </Card>

        {/* Task Completion Quality */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center"><Camera className="h-4 w-4 mr-1"/> Docs Submitted:</span>
                <span>{qualityData.docsSubmittedPercent}%</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tasks Missing Context:</span>
                <span>{qualityData.tasksMissingContext}</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center"><ClipboardCheck className="h-4 w-4 mr-1"/> Triggered Follow-Up:</span>
                <span>{qualityData.tasksTriggeringFollowUp}</span>
            </div>
          </CardContent>
        </Card>

        {/* Training & Onboarding Insight */}
        <Card>
          <CardHeader>
            <CardTitle>Training & Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center"><Brain className="h-4 w-4 mr-1"/> Users Needing Coaching:</span>
                <span>{trainingData.usersNeedingCoaching.length}</span>
                {/* TODO: Link to user list/details */} 
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center"><HelpCircle className="h-4 w-4 mr-1"/> Help Content Accessed:</span>
                <span>{trainingData.helpContentAccessRate}%</span>
              </div>
              <div>
                  <span className="text-muted-foreground">Top Retraining Areas:</span>
                  <ul className="list-disc list-inside text-xs pl-2 mt-1">
                      {trainingData.topRetrainingAreas.map(area => <li key={area}>{area}</li>)}
                  </ul>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 