import { Node, Edge } from "reactflow";

interface ForceNode extends Node {
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export function getForceLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  width: number = 2000,
  height: number = 2000
) {
  // Initialize force nodes with random positions if not set
  const forceNodes: ForceNode[] = nodes.map((node) => ({
    ...node,
    position: node.position || {
      x: Math.random() * width,
      y: Math.random() * height,
    },
    vx: 0,
    vy: 0,
  }));

  // Calculate node degrees (number of connections) for sizing
  const nodeDegrees = new Map<string, number>();
  edges.forEach((edge) => {
    nodeDegrees.set(edge.source, (nodeDegrees.get(edge.source) || 0) + 1);
    nodeDegrees.set(edge.target, (nodeDegrees.get(edge.target) || 0) + 1);
  });

  // Force simulation parameters
  const alpha = 1;
  const alphaDecay = 0.02;
  const iterations = 300;
  const linkDistance = 150;
  const linkStrength = 0.5;
  const chargeStrength = -800;
  const centerStrength = 0.1;

  // Run force simulation
  for (let i = 0; i < iterations; i++) {
    const currentAlpha = alpha * Math.pow(1 - alphaDecay, i);

    // Reset forces
    forceNodes.forEach((node) => {
      node.vx = 0;
      node.vy = 0;
    });

    // Apply link forces (attraction)
    edges.forEach((edge) => {
      const source = forceNodes.find((n) => n.id === edge.source);
      const target = forceNodes.find((n) => n.id === edge.target);
      if (!source || !target) return;

      const dx = target.position.x - source.position.x;
      const dy = target.position.y - source.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (distance - linkDistance) * linkStrength * currentAlpha;

      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      source.vx = (source.vx || 0) + fx;
      source.vy = (source.vy || 0) + fy;
      target.vx = (target.vx || 0) - fx;
      target.vy = (target.vy || 0) - fy;
    });

    // Apply charge forces (repulsion)
    for (let j = 0; j < forceNodes.length; j++) {
      for (let k = j + 1; k < forceNodes.length; k++) {
        const nodeA = forceNodes[j];
        const nodeB = forceNodes[k];

        const dx = nodeB.position.x - nodeA.position.x;
        const dy = nodeB.position.y - nodeA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (chargeStrength * currentAlpha) / (distance * distance);

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        nodeA.vx = (nodeA.vx || 0) - fx;
        nodeA.vy = (nodeA.vy || 0) - fy;
        nodeB.vx = (nodeB.vx || 0) + fx;
        nodeB.vy = (nodeB.vy || 0) + fy;
      }
    }

    // Apply center force
    const centerX = width / 2;
    const centerY = height / 2;
    forceNodes.forEach((node) => {
      const dx = centerX - node.position.x;
      const dy = centerY - node.position.y;
      node.vx = (node.vx || 0) + dx * centerStrength * currentAlpha;
      node.vy = (node.vy || 0) + dy * centerStrength * currentAlpha;
    });

    // Update positions
    forceNodes.forEach((node) => {
      node.position.x += node.vx || 0;
      node.position.y += node.vy || 0;
    });
  }

  // Update nodes with connection count for sizing
  const updatedNodes = forceNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      connectionCount: nodeDegrees.get(node.id) || 0,
    },
  }));

  return { nodes: updatedNodes, edges };
}

