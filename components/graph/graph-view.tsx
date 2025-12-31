"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Controls,
  Background,
  MiniMap,
  NodeMouseHandler,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { EnhancedFileNode } from "./utils/file-node";
import { PrimarySidebar } from "./sidebar/primary-sidebar";
import { SecondarySidebar } from "./sidebar/secondary-sidebar";
import { GraphPanel } from "./utils/graph-panel";
import { LoadingGraphScreen } from "./utils/graph-loader";
import { ErrorGraphScreen } from "./utils/graph-error";
import { useGraphData } from "@/hooks/graph/useGraphData";

interface GraphViewProps {
  projectId: string;
}

const nodeTypes = {
  default: EnhancedFileNode,
};

export function GraphView({ projectId }: GraphViewProps) {
  const {
    nodes,
    edges,
    loading,
    error,
    direction,
    connectionType,
    setEdges,
    stats,
    onNodesChange,
    onEdgesChange,
    refreshGraph,
    onLayout,
    onConnectionTypeChange,
    setNodes,
  } = useGraphData({ projectId });

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [primarySidebarOpen, setPrimarySidebarOpen] = useState(true);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(false);

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, clickedNode) => {
      setSelectedNode(clickedNode);
      setSecondarySidebarOpen(true);

      // 1. Identify neighbors (nodes connected to the clicked node)
      const connectedNodeIds = new Set<string>();
      connectedNodeIds.add(clickedNode.id); // Always show the clicked node itself

      edges.forEach((edge) => {
        if (edge.source === clickedNode.id) connectedNodeIds.add(edge.target);
        if (edge.target === clickedNode.id) connectedNodeIds.add(edge.source);
      });

      // 2. Hide all nodes that are NOT neighbors
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          hidden: !connectedNodeIds.has(node.id),
        }))
      );

      // 3. Hide unrelated edges and highlight connected ones
      setEdges((eds) =>
        eds.map((edge) => {
          const isConnected =
            edge.source === clickedNode.id || edge.target === clickedNode.id;

          return {
            ...edge,
            hidden: !isConnected, // Hide edges not connected to this node
            animated: isConnected,
            zIndex: isConnected ? 10 : 0,
            style: {
              ...edge.style,
              strokeWidth: isConnected ? 3 : 2.5,
              stroke: isConnected ? "#3b82f6" : edge.style?.stroke,
              opacity: 1, // Ensure visible edges are fully opaque
            },
          };
        })
      );
    },
    [edges, setNodes, setEdges]
  );

  const handleFileSelect = useCallback((node: Node) => {
    setSelectedNode(node);
    setSecondarySidebarOpen(true);
  }, []);

  const handleCloseSecondarySidebar = useCallback(() => {
    setSelectedNode(null);
    setSecondarySidebarOpen(false);

    // RESET: Show all nodes
    setNodes((nds) => nds.map((n) => ({ ...n, hidden: false })));

    // RESET: Show all edges and revert styles to default
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        hidden: false,
        animated: false,
        zIndex: 0,
        style: {
          ...edge.style,
          strokeWidth: 2.5,
          stroke: edge.data?.type === "external" ? "#ef4444" : "#10b981",
          opacity: 0.6, // Restore default opacity
        },
      }))
    );
  }, [setNodes, setEdges]);

  if (loading) {
    return <LoadingGraphScreen />;
  }

  if (error) {
    return <ErrorGraphScreen error={error} onRetry={refreshGraph} />;
  }

  return (
    <div className="flex h-full w-full">
      {/* Primary Sidebar */}
      <PrimarySidebar
        nodes={nodes}
        stats={stats}
        onFileSelect={handleFileSelect}
        selectedNode={selectedNode}
        isOpen={primarySidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionLineType={connectionType}
          fitView
          minZoom={0.05}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          defaultEdgeOptions={{
            animated: false,
            style: {
              strokeWidth: 2,
              opacity: 0.6,
            },
          }}
        >
          <Background
            color="#e5e7eb"
            gap={20}
            size={2}
            variant={BackgroundVariant.Dots}
          />
          <Controls
            className="bg-white shadow-lg rounded-lg border border-gray-200"
            showInteractive={false}
          />
          <MiniMap
            nodeColor={(node) => {
              const lang = node.data?.details?.language;
              if (lang === "typescript" || lang === "tsx") return "#3b82f6";
              if (lang === "javascript" || lang === "jsx") return "#eab308";
              if (lang === "python") return "#22c55e";
              return "#6b7280";
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="bg-white shadow-lg rounded-lg border border-gray-200"
          />

          <GraphPanel
            direction={direction}
            connectionType={connectionType}
            onLayout={onLayout}
            onConnectionTypeChange={onConnectionTypeChange}
            fetchGraph={refreshGraph}
            primarySidebarOpen={primarySidebarOpen}
            setPrimarySidebarOpen={setPrimarySidebarOpen}
            secondarySidebarOpen={secondarySidebarOpen}
            setSecondarySidebarOpen={setSecondarySidebarOpen}
            selectedNode={selectedNode}
          />
        </ReactFlow>
      </div>

      {/* Secondary Sidebar */}
      <SecondarySidebar
        selectedNode={selectedNode}
        nodes={nodes}
        edges={edges}
        onClose={handleCloseSecondarySidebar}
        isOpen={secondarySidebarOpen}
      />
    </div>
  );
}
