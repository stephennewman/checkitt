// Test comment
'use client';

import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, AlertTriangle, FileText, Download, Filter, Archive, ShieldCheck, ListChecks, History, Search } from 'lucide-react'; // Icons

// --- Data Structures & Dummy Data ---

interface AuditSummaryData {
  sitesMonitored: number;
  tempCoverage: number; // percentage
  excursionsLast30Days: number;
  correctiveActionsLogged: number;
  outstandingIssues: number;
  complianceRating: number; // percentage
}

interface ExcursionLog {
  id: string;
  date: string;
  location: string;
  assetId: string;
  issueType: string;
  tempCelsius?: number;
  actionTaken: string;
  resolutionTime: string;
  signedOffBy: string;
}

interface RegulatoryChecklistItem {
  id: string;
  category: 'FDA' | 'USDA' | 'WHO' | 'HIPAA';
  description: string;
  status: 'compliant' | 'issue' | 'not-applicable';
  details?: string;
}

// Dummy Data Instances
const auditSummary: AuditSummaryData = {
  sitesMonitored: 174,
  tempCoverage: 100,
  excursionsLast30Days: 12,
  correctiveActionsLogged: 12,
  outstandingIssues: 0,
  complianceRating: 99.2,
};

const excursionLog: ExcursionLog[] = [
  { id: 'ex001', date: '2025-04-10', location: 'Boston Site A', assetId: 'FZ-8821', issueType: 'High Temp Spike', tempCelsius: 9.3, actionTaken: 'Task Created & Closed', resolutionTime: '32 min', signedOffBy: 'M. Ramos' },
  { id: 'ex002', date: '2025-04-08', location: 'Toronto Clinic', assetId: 'FZ-2180', issueType: 'Sensor Disconnect', actionTaken: 'Backup asset used', resolutionTime: '1h 12m', signedOffBy: 'Dr. Patel' },
  { id: 'ex003', date: '2025-04-05', location: 'Miami Warehouse', assetId: 'RF-1050', issueType: 'Low Temp Alarm', tempCelsius: -2.5, actionTaken: 'Recalibrated Sensor', resolutionTime: '45 min', signedOffBy: 'J. Chen' },
];

const regulatoryChecklist: RegulatoryChecklistItem[] = [
  { id: 'rc001', category: 'FDA', description: 'All cold storage assets calibrated in last 30 days', status: 'compliant' },
  { id: 'rc002', category: 'FDA', description: 'Excursion reports require final sign-off within 24h', status: 'compliant' },
  { id: 'rc003', category: 'USDA', description: 'Traceability logs maintained for all meat products', status: 'compliant' },
  { id: 'rc004', category: 'HIPAA', description: 'Access logs for patient data servers reviewed weekly', status: 'not-applicable' }, // Example for non-relevant category
  { id: 'rc005', category: 'WHO', description: 'Vaccine temperature ranges maintained per guidelines', status: 'compliant' },
  { id: 'rc006', category: 'FDA', description: '2 excursion reports missing final sign-off', status: 'issue', details: 'IDs: ex004, ex005 from April 1st' },
];

// --- Helper Components (Example for Summary Card) ---

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

// --- Main Page Component ---

export default function CompliancePage() {
  const [isAuditMode, setIsAuditMode] = useState(false);

  // Filter data based on audit mode (simple example)
  const displayExcursionLog = isAuditMode 
    ? excursionLog.filter(log => log.signedOffBy) // Only show signed-off logs in audit mode
    : excursionLog;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Compliance & Audit Center</h1>
        <div className="flex items-center space-x-2">
          <Switch 
            id="audit-mode" 
            checked={isAuditMode}
            onCheckedChange={setIsAuditMode} 
          />
          <Label htmlFor="audit-mode" className="flex items-center">
            <ShieldCheck className={`w-4 h-4 mr-1 ${isAuditMode ? 'text-primary' : 'text-muted-foreground'}`} />
            Audit Mode {isAuditMode ? 'On' : 'Off'}
          </Label>
          {isAuditMode && (
            <Button size="sm" variant="outline">
              <FileText className="w-4 h-4 mr-1" /> Print Audit Packet
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground">
        {isAuditMode 
          ? 'Showing finalized, audit-ready data only.' 
          : 'View compliance status, logs, and generate reports.'}
      </p>

      {/* 1. Audit Summary Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard title="Sites Monitored" value={auditSummary.sitesMonitored} />
        <SummaryCard title="Temp Data Coverage" value={`${auditSummary.tempCoverage}%`} />
        <SummaryCard title="Excursions (30d)" value={auditSummary.excursionsLast30Days} />
        <SummaryCard title="Corrective Actions" value={auditSummary.correctiveActionsLogged} />
        <SummaryCard title="Outstanding Issues" value={auditSummary.outstandingIssues} />
        <SummaryCard title="Compliance Rating" value={`${auditSummary.complianceRating}%`} />
      </div>

      {/* 2. Excursion Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
             <History className="w-5 h-5 mr-2"/> Excursion Log
          </CardTitle>
          <CardDescription>Recorded temperature deviations and sensor issues. {isAuditMode && "(Finalized Only)"}</CardDescription>
          {/* Add Filtering controls here */} 
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Signed Off</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayExcursionLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell>{log.assetId}</TableCell>
                  <TableCell>{log.issueType}</TableCell>
                  <TableCell>{log.tempCelsius ?? 'N/A'}</TableCell>
                  <TableCell>{log.actionTaken}</TableCell>
                  <TableCell>{log.resolutionTime}</TableCell>
                  <TableCell>{log.signedOffBy ?? '-'}</TableCell>
                </TableRow>
              ))}
               {displayExcursionLog.length === 0 && (
                 <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No excursions recorded{isAuditMode ? " matching audit criteria" : ""}.</TableCell></TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3. Traceability Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2"/> Traceability Report
            </CardTitle>
            <CardDescription>Generate history for specific items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Item Name (e.g., Frozen Chicken Breast)" />
            {/* Add Date Range Picker here */}
            <Input placeholder="Location (e.g., Boston Site A)" />
             <div className="flex gap-2">
                 <Button className="w-full"><Download className="w-4 h-4 mr-2"/>Generate PDF</Button>
                 <Button variant="outline" className="w-full">Send Secure Link</Button>
            </div>
          </CardContent>
        </Card>

        {/* 4. Regulatory Checklist Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="w-5 h-5 mr-2"/> Regulatory Checklist
            </CardTitle>
            <CardDescription>Site-level compliance status.</CardDescription>
            {/* Add Industry Toggle (FDA/USDA etc) here */}
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
              {regulatoryChecklist.filter(item => item.status !== 'not-applicable').map(item => (
                 <AccordionItem value={item.id} key={item.id}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center">
                        {item.status === 'compliant' && <CheckCircle className="w-4 h-4 mr-2 text-green-600" />}
                        {item.status === 'issue' && <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />}
                        {item.description}
                      </div>
                    </AccordionTrigger>
                   {item.status === 'issue' && item.details && (
                    <AccordionContent className="text-xs text-muted-foreground pl-6">
                      Details: {item.details}
                    </AccordionContent>
                   )}
                 </AccordionItem>
              ))}
             </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* 5. Corrective Actions Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
             <Archive className="w-5 h-5 mr-2"/> Corrective Actions Archive
            </CardTitle>
          <CardDescription>History of resolved issues and actions taken.</CardDescription>
           <div className="flex flex-col sm:flex-row gap-2 pt-4">
             {/* Add Filter controls here (Type, Status etc) */}
             <Input placeholder="Search descriptions..." className="max-w-sm" />
              <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Filters</Button>
           </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for Corrective Actions Table/List */}
          <p className="text-center text-muted-foreground py-4">Corrective actions list/table will appear here.</p>
           {/* Example Structure (replace with actual table later) */}
            {/*
            <Table>
              <TableHeader>...</TableHeader>
              <TableBody>
                {correctiveActions.map(ca => (...))}
              </TableBody>
            </Table>
            */}
        </CardContent>
      </Card>

    </div>
  );
} 