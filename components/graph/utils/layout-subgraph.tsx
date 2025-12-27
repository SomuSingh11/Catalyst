import dagre from "dagre";

export function layoutSubgraph(
  nodes: any[],
  edges: any[],
  direction: "TB" | "LR" = "TB"
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";

  g.setGraph({
    rankdir: direction,
    ranksep: 60, // ↓ tighter spacing → nodes cluster closer
    nodesep: 60,
    marginx: 10,
    marginy: 10,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 300, height: 200 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);

    return {
      ...node,
      position: {
        x: pos.x - 150,
        y: pos.y - 100,
      },
      sourcePosition: isHorizontal ? "right" : "bottom",
      targetPosition: isHorizontal ? "left" : "top",
    };
  });
}
