'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  type Node,
  type Edge,
  BackgroundVariant,
} from 'reactflow';

import 'reactflow/dist/style.css'; // Import React Flow styles

// Keep custom node import commented out for now
// import SopNode, { type SopNodeData } from '@/components/sop-node';
import { CheckSquare, Clock } from 'lucide-react'; // Keep icons for data

// Re-added Initial Nodes Data (but removed custom type for now)
const initialNodes: Node[] = [ // Use default Node type for now
  {
    id: '1', 
    position: { x: 50, y: 150 }, 
    data: { label: 'Temp Excursion Detected' }, // Default nodes only use 'label'
    // type: 'sopNode', // Keep commented out
  },
  {
    id: '2', 
    position: { x: 350, y: 50 }, 
    data: { label: 'Assign Task: Check Temp' },
    // type: 'sopNode',
  },
  {
    id: '3', 
    position: { x: 350, y: 250 }, 
    data: { label: 'Escalate: Notify Manager' },
    // type: 'sopNode',
  },
    {
    id: '4', 
    position: { x: 650, y: 50 }, 
    data: { label: 'Perform Freezer Check' },
    // type: 'sopNode',
  },
    {
    id: '5', 
    position: { x: 950, y: 50 }, 
    data: { label: 'Submit Report' },
    // type: 'sopNode',
  },
    {
    id: '6', 
    position: { x: 1250, y: 150 }, 
    data: { label: 'Management Review' },
    // type: 'sopNode',
  },
  {
    id: '7', 
    position: { x: 1550, y: 150 }, 
    data: { label: 'Initiate Follow-Up Task' },
    // type: 'sopNode',
  },
];

// Re-added Initial Edges Data
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: false, style: { stroke: '#f97316' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } }, // Escalation path
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-7', source: '6', target: '7', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

// --- Page Component ---
export default function SopCanvasPage() {
  // Re-added state hooks for nodes/edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep node type registration commented out
  // const nodeTypes = useMemo(() => ({ sopNode: SopNode }), []);

  return (
    // Use fixed viewport height for testing
    <div className="w-full h-[85vh]" >
      <ReactFlow
        // Re-add nodes/edges props
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // Keep nodeTypes commented out
        fitView // Automatically zoom/pan to fit nodes on initial load
        className="bg-muted/30" // Light background for the canvas
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
} 