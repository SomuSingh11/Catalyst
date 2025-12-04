import path from "path";
import { ParseResult } from "@/types/parser";

export type Relationship = {
  id: string;
  sourceFile: string;
  targetFile: string;
  type: "internal" | "external";
  symbols: string[];
};

export class RelationshipBuilder {
  private fileSet: Set<string>;
  private parsedResults: ParseResult[];

  constructor(results: ParseResult[]) {
    this.parsedResults = results;
    this.fileSet = new Set(results.map((r) => this.normalizePath(r.filePath)));
  }

  public build(): Relationship[] {
    const relationships: Relationship[] = [];

    for (const file of this.parsedResults) {
      const sourcePath = this.normalizePath(file.filePath);

      const imports = file.entities.filter((e) => e.type === "import");

      for (const imp of imports) {
        const importData = imp.importData;
        if (!importData) continue;

        const rawSource = importData.source;

        // --- Resolve
        const resolvedTarget = this.resolvePath(sourcePath, rawSource);

        // --- Fix Type Issue: Build symbols: string[]
        const symbols: string[] = importData.specifiers
          .map((s) => s.imported)
          .filter((x): x is string => typeof x === "string");

        if (importData.isDefault && importData.defaultImportName) {
          symbols.push(importData.defaultImportName);
        }

        // --- Internal link
        if (resolvedTarget) {
          relationships.push({
            id: `${sourcePath} -> ${resolvedTarget}`,
            sourceFile: sourcePath,
            targetFile: resolvedTarget,
            type: "internal",
            symbols,
          });
        }
        // --- External link
        else {
          relationships.push({
            id: `${sourcePath} -> ${rawSource}`,
            sourceFile: sourcePath,
            targetFile: rawSource,
            type: "external",
            symbols,
          });
        }
      }
    }

    return relationships;
  }

  /**
   * Convert imports like:
   * - "./utils" → "components/dashboard/utils.ts"
   * - "@/utils/colors" → "utils/colors.ts"
   */
  private resolvePath(currentFile: string, importPath: string): string | null {
    // A. External library
    if (!importPath.startsWith(".") && !importPath.startsWith("@/")) {
      return null;
    }

    let candidate = "";

    // B. Next.js alias
    if (importPath.startsWith("@/")) {
      candidate = importPath.replace("@/", "");
    } else {
      // C. Relative paths
      const currentDir = path.dirname(currentFile);
      candidate = path.join(currentDir, importPath);
    }

    // Try common extensions
    const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];

    for (const ext of exts) {
      const probe = this.normalizePath(candidate + ext);
      if (this.fileSet.has(probe)) {
        return probe;
      }
    }

    return null;
  }

  private normalizePath(p: string): string {
    return p.replace(/\\/g, "/");
  }
}
