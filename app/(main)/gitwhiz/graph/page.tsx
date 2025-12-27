"use client";

import useProject from "@/hooks/use-project";
import { GraphView } from "../../../../components/graph/graph-view";

export default function GraphPage() {
  const { projectId } = useProject();

  return (
    <div className="w-full h-full flex flex-col">
      <GraphView projectId={projectId} />
    </div>
  );
}
