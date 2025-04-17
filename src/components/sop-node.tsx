import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ListChecks, CheckCircle, User } from 'lucide-react';

// Define the structure of the data passed to the node
export interface SopNodeData {
  label: string; // Title
  type: 'Trigger' | 'Task' | 'Review' | 'Escalation' | 'Info';
  assigned?: string;
  details?: string; // Additional description or context
  statusIcon?: React.ReactNode; // Optional icon for status
  tooltip?: string; // Simple tooltip text
}

// Define styles based on node type
const getNodeStyle = (type: SopNodeData['type']) => {
  switch (type) {
    case 'Trigger': return 'border-red-500 bg-red-50';
    case 'Task': return 'border-blue-500 bg-blue-50';
    case 'Review': return 'border-green-500 bg-green-50';
    case 'Escalation': return 'border-orange-500 bg-orange-50';
    default: return 'border-gray-300 bg-gray-50';
  }
};

const getTypeIcon = (type: SopNodeData['type']) => {
     switch (type) {
        case 'Trigger': return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'Task': return <ListChecks className="h-4 w-4 text-blue-500" />;
        case 'Review': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Escalation': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
        default: return null;
    }
}

const SopNode: React.FC<NodeProps<SopNodeData>> = ({ data }) => {
  return (
    <Card 
        className={`w-64 shadow-md ${getNodeStyle(data.type)}`} 
        title={data.tooltip || data.label} // Use correct quotes
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400" />
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>{data.label}</span>
          <Badge variant="outline" className="ml-2 text-xs">{getTypeIcon(data.type)} {data.type}</Badge>
        </CardTitle> 
        {data.details && <CardDescription className="text-xs pt-1">{data.details}</CardDescription>}
      </CardHeader>
      {data.assigned && (
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground flex items-center">
           <User className="h-3 w-3 mr-1" /> Assigned: {data.assigned}
           {/* Optional status icon could go here */}
           {data.statusIcon && <span className="ml-auto">{data.statusIcon}</span>}
        </CardContent>
      )}
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400" />
    </Card>
  );
};

export default memo(SopNode); 