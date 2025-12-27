import type { ParseResult } from "@/types/parser";
import { Relationship } from "./relationship-builder";

export function transformToReactFlow(
  parseResults: ParseResult[],
  relationships: Relationship[]
) {
  const nodes = parseResults.map((file, i) => ({
    id: file.filePath,
    position: { x: i * 10, y: i * 10 },
    type: "default",
    data: {
      label: file.filePath.split("/").pop(),
      details: {
        fullPath: file.filePath,
        language: file.language,
        metrics: file.metrics,
        imports: file.entities.filter((e) => e.type === "import"),
        exports: file.entities.filter((e) => e.type === "export"),
        entities: file.entities,
      },
    },
  }));

  const edges = relationships.map((r) => ({
    id: r.id,
    source: r.sourceFile,
    target: r.targetFile,
    data: { symbols: r.symbols },
    relationshipType: r.type,
  }));

  return { nodes, edges };
}
