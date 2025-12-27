import dagre from "dagre";
import { Node, Edge, Position } from "reactflow";

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";

  g.setGraph({
    rankdir: direction,
    ranksep: 200,
    nodesep: 150,
    marginx: 100,
    marginy: 100,
    ranker: "longest-path",
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 380, height: 280 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    if (!nodeWithPosition) return node;

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - 190,
        y: nodeWithPosition.y - 140,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
