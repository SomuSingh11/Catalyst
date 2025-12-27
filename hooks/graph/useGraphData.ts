/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLayoutedElements } from "@/lib/graph/layout";
import { api } from "@/trpc/react";
import { useCallback, useEffect, useState } from "react";
import {
  ConnectionLineType,
  MarkerType,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";

interface UseGraphDataProps {
  projectId: string;
}

export function useGraphData({ projectId }: UseGraphDataProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [direction, setDirection] = useState<"TB" | "LR">("TB");
  const [connectionType, setConnectionType] = useState<ConnectionLineType>(
    ConnectionLineType.Bezier
  );

  const [stats, setStats] = useState({
    totalFiles: 0,
    totalDependencies: 0,
    totalFunctions: 0,
    totalClasses: 0,
    avgComplexity: 0,
  });

  const generateGraph = api.graph.generateGraph.useMutation({
    onSuccess(data) {
      processGraphData(data);
    },
    onError(error) {
      console.error("Graph fetch error:", error);
      setError(error.message || "Unknown error");
    },
  });

  const refreshGraph = useCallback(() => {
    if (!projectId) return;
    setLoading(true);
    generateGraph.mutate({ projectId });
  }, [projectId]);

  useEffect(() => {
    refreshGraph();
  }, [refreshGraph]);

  const processGraphData = (data: { nodes: any[]; edges: any[] }) => {
    try {
      const graphNodes: any[] = data.nodes.map((node) => {
        return {
          id: node.id,
          type: node.type || "default",
          data: node.data,
          position: node.position,

          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
      });

      const validNodeIds = new Set(graphNodes.map((node) => node.id));

      const graphEdges: any[] = data.edges
        .filter(
          (edge) =>
            validNodeIds.has(edge.source) && validNodeIds.has(edge.target)
        )
        .map((edge) => {
          const isExternal = edge.relationshipType === "external";
          const color = isExternal ? "#ef4444" : "#10b981";

          return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.data?.symbols?.slice(0, 2).join(", ") || "",
            type: connectionType,
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 25,
              height: 25,
              color,
            },
            style: {
              strokeWidth: 2.5,
              stroke: color,
            },
            labelStyle: {
              fontSize: 11,
              fill: "#374151",
              fontWeight: 600,
              fontFamily: "monospace",
            },
            labelBgStyle: {
              fill: "#ffffff",
              fillOpacity: 0.95,
              rx: 6,
              ry: 6,
            },
            labelBgPadding: [8, 4] as [number, number],
            data: edge.data,
            pathOptions: {
              offset: 20,
              borderRadius: 10,
            },
          };
        });

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(graphNodes, graphEdges, direction);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      const totalFunctions = graphNodes.reduce(
        (sum, n) => sum + (n.data.details?.metrics?.functionCount || 0),
        0
      );
      const totalClasses = graphNodes.reduce(
        (sum, n) => sum + (n.data.details?.metrics?.classCount || 0),
        0
      );
      const avgComplexity =
        graphNodes.reduce(
          (sum, n) => sum + (n.data.details?.metrics?.complexity || 0),
          0
        ) / (graphNodes.length || 1);

      setStats({
        totalFiles: graphNodes.length,
        totalDependencies: graphEdges.length,
        totalFunctions,
        totalClasses,
        avgComplexity: Math.round(avgComplexity * 10) / 10,
      });
    } catch (error) {
      console.error("Error processing graph data:", error);
      setError("Error processing graph data");
    } finally {
      setLoading(false);
    }
  };

  const onLayout = useCallback(
    (newDirection: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, newDirection);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      setDirection(newDirection);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const onConnectionTypeChange = useCallback(
    (newType: ConnectionLineType) => {
      setConnectionType(newType);
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          type: newType,
        }))
      );
    },
    [setEdges]
  );

  return {
    nodes,
    edges,
    loading,
    error,
    direction,
    connectionType,
    setDirection,
    setNodes,
    stats,
    onNodesChange,
    onEdgesChange,
    refreshGraph,
    onLayout,
    onConnectionTypeChange,
    setEdges,
  };
}
