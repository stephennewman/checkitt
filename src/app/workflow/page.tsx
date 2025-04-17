'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose
} from "@/components/ui/sheet";
import { WorkflowForm } from '@/components/workflow/form';
import { PlusCircle, ListChecks } from 'lucide-react';

// --- Dummy Data (Placeholder) ---
interface WorkflowItem {
  id: string;
  name: string;
  type: 'Checklist' | 'SOP' | 'Process';
  trigger: 'Scheduled' | 'Manual' | 'Event-Based';
  assignments: string; // Simple string for now (e.g., "Site Ops Team", "J. Doe")
  lastModified: string;
}

const workflows: WorkflowItem[] = [
  { id: 'wf1', name: 'Daily Freezer Temp Log', type: 'Checklist', trigger: 'Scheduled', assignments: 'Site Ops', lastModified: '2024-07-28' },
  { id: 'wf2', name: 'New Equipment Onboarding', type: 'Process', trigger: 'Manual', assignments: 'Maintenance Lead', lastModified: '2024-07-15' },
  { id: 'wf3', name: 'Receiving Goods Protocol', type: 'Checklist', trigger: 'Event-Based', assignments: 'Receiving Team', lastModified: '2024-06-30' },
];

// --- Main Page Component ---
export default function WorkflowPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Dummy save handler
  const handleSaveWorkflow = (formData: any) => {
    console.log("Workflow saved in page:", formData);
    // Add logic to actually save/update workflow list here
    setIsSheetOpen(false); // Close the sheet after save
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <h1 className="text-2xl font-bold tracking-tight flex items-center">
             <ListChecks className="w-6 h-6 mr-2" /> Workflow Configuration
          </h1>
           <SheetTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" /> Create New Workflow/Task
              </Button>
           </SheetTrigger>
        </div>

         <Card>
          <CardHeader>
            <CardTitle>Existing Workflows & Tasks</CardTitle>
            <CardDescription>Manage your configured checklists and processes.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2">
              {workflows.map(wf => (
                <li key={wf.id} className="border p-3 rounded-md text-sm">
                  <span className="font-medium">{wf.name}</span> ({wf.type}) - Trigger: {wf.trigger} - Assigned: {wf.assignments}
                </li>
              ))}
            </ul>
             {workflows.length === 0 && <p className="text-muted-foreground text-center py-4">No workflows configured yet.</p>}
          </CardContent>
        </Card>
      </div>

       <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
         <SheetHeader>
           <SheetTitle>Create New Workflow/Task</SheetTitle>
           <SheetDescription>
             Define the details, triggers, steps, and assignments for your new workflow.
           </SheetDescription>
         </SheetHeader>
         <div className="py-4">
           <WorkflowForm onSave={handleSaveWorkflow} />
         </div>
         <SheetFooter>
           <SheetClose asChild>
             <Button type="button" variant="outline">Cancel</Button>
           </SheetClose>
            <Button type="button" onClick={() => {
              // Ideally, trigger form submission validation here before calling save 
              // For now, just calling the dummy save directly
              handleSaveWorkflow({ basic: 'data' }); // Pass dummy data or get actual form state
            }}>Save Workflow</Button>
         </SheetFooter>
       </SheetContent>
    </Sheet>
  );
} 