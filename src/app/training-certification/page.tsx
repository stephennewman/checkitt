'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Lightbulb, UserCog, Target } from 'lucide-react'; // Icons

// --- Data Structures & Dummy Data ---

type Role = 'Site Ops' | 'Maintenance' | 'Managers' | 'Supervisors' | 'Site Leads' | 'All Staff';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  relatedTaskOrSop: string;
  estimatedDuration: number; // in minutes
  roles: Role[];
  quizQuestions: number; // Number of questions
  hasChecklist?: boolean;
  hasFlowchart?: boolean;
  hasExamples?: boolean;
  icon?: React.ElementType;
}

interface UserProgress {
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercent: number;
  completedDate?: Date;
}

interface HistoricalIssue {
  id: string;
  type: 'task' | 'sop_step';
  name: string;
  issue: string; // e.g., 'Miss Rate', 'Delayed', 'Missing Docs'
  metricValue: number; // e.g., 0.15 for 15%
  suggestedModuleId: string;
}

// Dummy Data Instances
const trainingModules: TrainingModule[] = [
  {
    id: 't1',
    title: 'Performing Accurate Temperature Checks',
    description: 'Covers best practices for measuring, logging, and responding to temp excursions.',
    relatedTaskOrSop: 'Freezer Temp Check Task',
    estimatedDuration: 10,
    roles: ['Site Ops', 'Maintenance'],
    quizQuestions: 3,
    hasChecklist: true,
    icon: Target
  },
  {
    id: 't2',
    title: 'Escalation Protocol & Approvals',
    description: 'When and how to escalate issues to managers according to SOP-003.',
    relatedTaskOrSop: 'SOP-003: Management Sign-Off',
    estimatedDuration: 15,
    roles: ['Supervisors', 'Site Leads'],
    quizQuestions: 0,
    hasFlowchart: true,
    icon: UserCog
  },
  {
    id: 't3',
    title: 'Documentation Best Practices',
    description: 'How to submit complete, compliant task documentation, including photos.',
    relatedTaskOrSop: 'Cleaning Checklist Task',
    estimatedDuration: 12,
    roles: ['All Staff'],
    quizQuestions: 5,
    hasExamples: true,
  },
  {
    id: 't4',
    title: 'SOP Navigation 101',
    description: 'Learn how to effectively use the SOP Canvas to understand workflows.',
    relatedTaskOrSop: 'SOP Canvas Usage',
    estimatedDuration: 8,
    roles: ['All Staff'],
    quizQuestions: 2,
  },
];

const historicalIssues: HistoricalIssue[] = [
  { id: 'h1', type: 'task', name: 'Freezer Temp Check', issue: 'Miss Rate', metricValue: 0.15, suggestedModuleId: 't1' },
  { id: 'h2', type: 'sop_step', name: 'Management Sign-Off', issue: 'Delayed', metricValue: 0.20, suggestedModuleId: 't2' },
  { id: 'h3', type: 'task', name: 'Cleaning Checklist', issue: 'Missing Docs', metricValue: 0.10, suggestedModuleId: 't3' },
];

// Simulate progress for a single user
const currentUserProgress: UserProgress[] = [
  { moduleId: 't1', status: 'in-progress', progressPercent: 40 },
  { moduleId: 't4', status: 'completed', progressPercent: 100, completedDate: new Date(Date.now() - 86400000 * 5) }, // Completed 5 days ago
  { moduleId: 't2', status: 'not-started', progressPercent: 0 },
];

// --- Reusable Components ---

interface TrainingModuleCardProps {
  module: TrainingModule;
  progress?: UserProgress;
}

const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({ module, progress }) => {
  const Icon = module.icon || BookOpen;
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
             <Icon className="w-5 h-5 mr-2 text-primary" />
            {module.title}
          </CardTitle>
          <Badge variant="outline">{module.estimatedDuration} min</Badge>
        </div>
        <CardDescription className="pt-1 line-clamp-2">{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-3">
          <p>Related: {module.relatedTaskOrSop}</p>
          <p>Roles: {module.roles.join(', ')}</p>
        </div>
        {progress ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-medium">
              <span>Progress</span>
              <span>{progress.progressPercent}%</span>
            </div>
            <Progress value={progress.progressPercent} className="h-2" />
             {progress.status === 'completed' && (
              <p className="text-xs text-green-600">Completed: {progress.completedDate?.toLocaleDateString()}</p>
            )}
             {progress.status === 'in-progress' && (
                 <Button size="sm" className="w-full mt-2">Continue</Button>
             )}
              {progress.status === 'not-started' && (
                 <Button size="sm" variant="outline" className="w-full mt-2">Start Course</Button>
             )}
          </div>
        ) : (
          <Button size="sm" variant="outline" className="w-full mt-2">View Course</Button>
        )}
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---

export default function TrainingCertificationPage() {

  // Derive suggested modules from historical issues
  const suggestedModules = historicalIssues
    .sort((a, b) => b.metricValue - a.metricValue) // Sort by highest issue metric
    .slice(0, 3) // Get top 3
    .map(issue => trainingModules.find(m => m.id === issue.suggestedModuleId))
    .filter(module => module !== undefined) as TrainingModule[];

  // Get modules assigned/in progress for the current user
  const assignedModules = trainingModules.filter(module => 
    currentUserProgress.some(p => p.moduleId === module.id && p.status !== 'completed')
  );
  // const completedModules = trainingModules.filter(module => 
  //   currentUserProgress.some(p => p.moduleId === module.id && p.status === 'completed')
  // );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold tracking-tight">Training</h1>

      {/* Section 1: User Dashboard / Assigned Training */}
      <Card>
        <CardHeader>
          <CardTitle>Your Active Training</CardTitle>
          <CardDescription>Courses assigned to you or currently in progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedModules.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {assignedModules.map(module => (
                <TrainingModuleCard 
                  key={module.id} 
                  module={module} 
                  progress={currentUserProgress.find(p => p.moduleId === module.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No active training assigned. Check the library below!</p>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Training Insights */}
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
             <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Suggested For You
            </CardTitle>
          <CardDescription>Based on recent operational insights and common challenges.</CardDescription>
        </CardHeader>
        <CardContent>
           {suggestedModules.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {suggestedModules.map(module => (
                 <TrainingModuleCard key={module.id} module={module} progress={currentUserProgress.find(p => p.moduleId === module.id)} />
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">No specific suggestions at this time.</p>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Course Library */}
      <Card>
        <CardHeader>
          <CardTitle>Course Library</CardTitle>
          <CardDescription>Browse all available training modules.</CardDescription>
           <div className="flex flex-col sm:flex-row gap-2 pt-4">
             <Input placeholder="Search courses..." className="max-w-sm" />
             <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {/* Add distinct roles from modules here */}
                   <SelectItem value="site-ops">Site Ops</SelectItem>
                   <SelectItem value="maintenance">Maintenance</SelectItem>
                   <SelectItem value="managers">Managers</SelectItem>
                   <SelectItem value="all-staff">All Staff</SelectItem>
                </SelectContent>
              </Select>
               <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trainingModules.map(module => (
              <TrainingModuleCard 
                key={module.id} 
                module={module} 
                progress={currentUserProgress.find(p => p.moduleId === module.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Admin View - Could be conditionally rendered or a separate page */}
      {/* <Card> ... Admin content ... </Card> */}

    </div>
  );
} 