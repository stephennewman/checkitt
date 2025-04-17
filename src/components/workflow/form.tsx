'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// --- Types ---

type WorkflowType = 'Checklist' | 'SOP' | 'Process';
type TriggerType = 'Manual' | 'Scheduled' | 'Event-Based';
type StepType = 'Instruction' | 'Checkbox' | 'Text Input' | 'Photo Upload';

interface WorkflowStep {
  id: string;
  description: string;
  type: StepType;
  required: boolean;
}

// Define specific form data type
export interface WorkflowFormData {
  name: string;
  description: string;
  type: WorkflowType;
  trigger: TriggerType;
  scheduleDetails?: Date;
  steps: WorkflowStep[];
  // Add assignments etc. later
}

// --- Component Props ---
interface WorkflowFormProps {
  // Remove unused prop
  // onSave: (formData: WorkflowFormData) => void; 
}

// --- Form Component ---
export const WorkflowForm: React.FC<WorkflowFormProps> = (/* { onSave } */) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkflowType>('Checklist');
  const [trigger, setTrigger] = useState<TriggerType>('Manual');
  const [scheduleDetails, setScheduleDetails] = useState<Date | undefined>(undefined);
  const [steps, setSteps] = useState<WorkflowStep[]>([]); 

  const addStep = () => {
    setSteps([...steps, { id: `step_${Date.now()}`, description: '', type: 'Instruction', required: false }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, field: keyof WorkflowStep, value: string | boolean) => {
    setSteps(steps.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

  return (
    <div className="space-y-6 p-1">
      {/* Section 1: Basic Details */} 
      <section>
        <h3 className="text-lg font-semibold mb-3">Basic Details</h3>
        <div className="space-y-3">
           <div>
             <Label htmlFor="workflow-name">Name</Label>
             <Input id="workflow-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Daily Store Opening Checklist" />
           </div>
           <div>
             <Label htmlFor="workflow-description">Description</Label>
             <Textarea id="workflow-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe the purpose..." />
           </div>
           <div>
             <Label htmlFor="workflow-type">Type</Label>
             <Select value={type} onValueChange={(value: WorkflowType) => setType(value)}>
               <SelectTrigger id="workflow-type">
                 <SelectValue placeholder="Select type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Checklist">Checklist</SelectItem>
                 <SelectItem value="SOP">SOP</SelectItem>
                 <SelectItem value="Process">Process</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>
      </section>

      <Separator />

      {/* Section 2: Trigger Configuration */} 
      <section>
        <h3 className="text-lg font-semibold mb-3">Trigger</h3>
         <RadioGroup value={trigger} onValueChange={(value: TriggerType) => setTrigger(value)} className="space-y-2">
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="Manual" id="trigger-manual" />
             <Label htmlFor="trigger-manual">Manual Start</Label>
           </div>
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="Scheduled" id="trigger-scheduled" />
             <Label htmlFor="trigger-scheduled">Scheduled</Label>
           </div>
            {trigger === 'Scheduled' && (
             <div className="pl-6 pt-2 space-y-3 border-l ml-2">
               <p className="text-sm text-muted-foreground">Configure schedule:</p>
                 <div>
                   <Label>Start Date/Time</Label>
                   <Popover>
                     <PopoverTrigger asChild>
                       <Button
                         variant={"outline"}
                         className={cn(
                           "w-full justify-start text-left font-normal",
                           !scheduleDetails && "text-muted-foreground"
                         )}
                       >
                         <CalendarIcon className="mr-2 h-4 w-4" />
                         {scheduleDetails ? format(scheduleDetails, "PPP") : <span>Pick a date</span>}
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0">
                       <Calendar
                         mode="single"
                         selected={scheduleDetails}
                         onSelect={setScheduleDetails}
                         initialFocus
                       />
                     </PopoverContent>
                   </Popover>
                 </div>
                 <Select>
                   <SelectTrigger>
                     <SelectValue placeholder="Select Frequency" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="daily">Daily</SelectItem>
                     <SelectItem value="weekly">Weekly</SelectItem>
                     <SelectItem value="monthly">Monthly</SelectItem>
                     <SelectItem value="custom">Custom</SelectItem>
                   </SelectContent>
                 </Select>
             </div>
           )}
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="Event-Based" id="trigger-event" />
             <Label htmlFor="trigger-event">Event-Based</Label>
           </div>
             {trigger === 'Event-Based' && (
             <div className="pl-6 pt-2 border-l ml-2">
               <Select>
                 <SelectTrigger>
                   <SelectValue placeholder="Select Trigger Event" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="excursion">Temperature Excursion</SelectItem>
                   <SelectItem value="new_asset">New Asset Added</SelectItem>
                   <SelectItem value="other">Other (Custom)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           )}
         </RadioGroup>
      </section>

      <Separator />

      {/* Section 3: Steps / Checklist Builder */} 
       <section>
         <div className="flex justify-between items-center mb-3">
           <h3 className="text-lg font-semibold">Steps / Checklist Items</h3>
           <Button variant="outline" size="sm" onClick={addStep}>
             <PlusCircle className="w-4 h-4 mr-1" /> Add Step
           </Button>
         </div>
         <div className="space-y-4">
           {steps.map((step, index) => (
             <Card key={step.id} className="p-4 bg-muted/30">
               <div className="flex justify-between items-start gap-2">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor={`step-desc-${step.id}`}>Step {index + 1}: Description</Label>
                    <Textarea 
                      id={`step-desc-${step.id}`} 
                      value={step.description} 
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      placeholder="Enter step instructions..."
                      rows={2}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                       <div>
                         <Label htmlFor={`step-type-${step.id}`}>Type</Label>
                         <Select 
                           value={step.type} 
                           onValueChange={(value: StepType) => updateStep(step.id, 'type', value)}
                         >
                           <SelectTrigger id={`step-type-${step.id}`} className="w-full sm:w-[180px]">
                             <SelectValue placeholder="Select step type" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Instruction">Instruction</SelectItem>
                             <SelectItem value="Checkbox">Checkbox</SelectItem>
                             <SelectItem value="Text Input">Text Input</SelectItem>
                             <SelectItem value="Photo Upload">Photo Upload</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="flex items-end pb-2">
                         <div className="flex items-center space-x-2">
                           <Checkbox 
                             id={`step-required-${step.id}`} 
                             checked={step.required}
                             onCheckedChange={(checked) => updateStep(step.id, 'required', !!checked)}
                            />
                           <Label htmlFor={`step-required-${step.id}`}>Required</Label>
                         </div>
                       </div>
                    </div>
                  </div>
                 <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 mt-5" onClick={() => removeStep(step.id)}>
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </div>
             </Card>
           ))}
           {steps.length === 0 && <p className="text-muted-foreground text-center text-sm py-4">No steps added yet.</p>}
         </div>
       </section>

      <Separator />

      {/* Section 4: Assignments (Placeholder) */} 
       <section>
         <h3 className="text-lg font-semibold mb-3">Assignments</h3>
         <div className="space-y-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Assign to User/Team..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">User: John Doe</SelectItem>
                <SelectItem value="team1">Team: Site Ops</SelectItem>
                <SelectItem value="team2">Team: Maintenance</SelectItem>
              </SelectContent>
            </Select>
             <Select>
              <SelectTrigger>
                <SelectValue placeholder="Assign to Location(s)..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loc1">Location: Boston Site A</SelectItem>
                <SelectItem value="loc2">Location: Toronto Clinic</SelectItem>
                <SelectItem value="all">All Locations</SelectItem>
              </SelectContent>
            </Select>
         </div>
       </section>

        <Separator />

      {/* Section 5: Next Steps / Logic (Placeholder) */} 
       <section>
         <h3 className="text-lg font-semibold mb-3">Next Steps / Logic</h3>
         <p className="text-sm text-muted-foreground">Define conditional logic or follow-up actions based on workflow completion or step outcomes (e.g., trigger another workflow, send notification).</p>
       </section>

    </div>
  );
}; 