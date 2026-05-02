import { ParseResult, ParsedEntity } from "@/types/parser";

// ─── Types ───────────────────────────────────────────────────

export interface CodeChunkInput {
    projectId   : string;
    filePath    : string;
    language    : string;
    chunkType   : string;
    entityName? : string;
    parentName? : string;
    rawCode     : string;
    signature?  : string;
    docstring?  : string;
    startLine   : number;
    endLine     : number;
    complexity? : number; 
}


// ─── Main chunker ────────────────────────────────────────────

/**
 * Takes a Tree-sitter ParseResult and produces entity-level chunks.
 *
 * Strategy:
 * 1. One FILE_SUMMARY chunk for the whole file (truncated)
 * 2. One chunk per function, class, method, interface, type alias
 * 3. One IMPORT_GROUP chunk aggregating all imports
 * 4. Skip trivial entities (empty, < 3 lines)
 *
 * This replaces the "1 embedding per file" approach.
 */

// export interface ParseResult {
//   filePath: string;
//   language: SupportedLanguageId;
//   entities: ParsedEntity[];
//   metrics?: FileMetrics;
//   timestamp: number;
//   parseTimeMs: number;
// }

export function chunkFile(
    parseResult: ParseResult,
    rawSource: string
): CodeChunkInput[] {
    const chunks: CodeChunkInput[] = [];
    const {filePath, language, entities} = parseResult;
    const lines = rawSource.split("\n");

    // ── 1. FILE_SUMMARY chunk ──────────────────────────────────
    // Use first 150 lines or up to 4000 chars — just enough for context
    const summaryCode = lines.slice(0, 150).join("\n").slice(0, 4000);
    chunks.push({
        projectId: "", // filled by caller
        filePath,
        language,
        chunkType: "FILE_SUMMARY",
        rawCode: summaryCode,
        startLine: 1,
        endLine: Math.min(150, lines.length)
    });

    // ── 2. IMPORT_GROUP chunk ──────────────────────────────────
    const importEntities = entities.filter((e) => e.type === "import");
    if(importEntities.length > 0) {
        const importLines = importEntities.map((e) => {
            if(!e.location) return null;
            return lines
                    .slice(e.location.start.line - 1, e.location.end.line)
                    .join("\n");
        })
        .filter(Boolean)
        .join("\n");

        if(importLines.trim()) {
            const firstImport = importEntities[0]!.location;
            const lastImport = importEntities[importEntities.length-1]!.location;

            chunks.push({
                projectId: "",
                filePath,
                language,
                chunkType: "IMPORT_GROUP",
                rawCode: importLines,
                startLine: firstImport?.start.line ?? 1,
                endLine: lastImport?.end.line ?? 1, 
            });
        }
    }

    // ── 3. Entity chunks ───────────────────────────────────────
    for(const entity of entities) {
        if(!entity.location) continue;

        const {start, end} = entity.location;
        const lineCount = end.line - start.line;

        // Skip trivial entities
        if(lineCount < 2) continue;
        if(!isChunkableType(entity.type)) continue;

        const entityLines = lines.slice(start.line - 1, end.line);
        const rawCode = entityLines.join("\n");

        // Skip the code if its almost empty
        if(rawCode.trim().length < 30) continue;

        // Extract docstring (comments immediately above the entity)
        const docstring = extractDocString(lines, start.line - 1);

        const chuck: CodeChunkInput = {
            projectId: "",
            filePath,
            language,
            chunkType: mapEntityTypeToChuckType(entity.type),
            entityName: entity.name !== "<anonymous>" ? entity.name : undefined,
            rawCode: rawCode.slice(0, 6000), // cap at ~1500 tokens
            signature: entity.signature?.slice(0, 300),
            docstring: docstring || undefined,
            startLine: start.line,
            endLine: end.line,
            complexity: entity.complexity, 
        };

        chunks.push(chuck);

        // ── 3a. Method chunks inside classes ──────────────────────
        // Classes get their own chunk AND each method gets its own chunk
        if(entity.children) {
            for(const child of entity.children) {
                if(!child.location) continue;
                if(!isChunkableType(child.type)) continue;

                const childLines = child.location.end.line - child.location.start.line;
                if(childLines < 2) continue;

                const childCode = lines
                                    .slice(child.location.start.line-1, child.location.end.line)
                                    .join("\n");

                if(childCode.trim().length < 20) continue;

                chunks.push({
                    projectId: "",
                    filePath,
                    language,
                    chunkType: mapEntityTypeToChuckType(entity.type),
                    entityName: child.name !== "<anonymous>" ? child.name : undefined,
                    parentName: entity.name !== "<anonymous>" ? entity.name : undefined,
                    rawCode: childCode.slice(0, 4000),
                    signature: child.signature?.slice(0, 300),
                    startLine: child.location.start.line,
                    endLine: child.location.end.line,
                    complexity: child.complexity,
                });
            }
        }
    }

    return deduplicateChunks(chunks);
}


// ─── Helpers ─────────────────────────────────────────────────
function isChunkableType(type: string): boolean {
    const chunkable = new Set([
    "function",
    "function_declaration",
    "function_expression",
    "arrow_function",
    "async_function",
    "class",
    "class_declaration",
    "class_expression",
    "method",
    "method_definition",
    "interface",
    "interface_declaration",
    "type",
    "type_alias_declaration",
    "export",
    "export_declaration",
  ]);
  return chunkable.has(type);
}

function mapEntityTypeToChuckType(entityType: string): string {
    const map: Record<string, string> = {
    function: "FUNCTION",
    function_declaration: "FUNCTION",
    function_expression: "FUNCTION",
    arrow_function: "FUNCTION",
    async_function: "FUNCTION",
    class: "CLASS",
    class_declaration: "CLASS",
    class_expression: "CLASS",
    method: "METHOD",
    method_definition: "METHOD",
    interface: "INTERFACE",
    interface_declaration: "INTERFACE",
    type: "TYPE_ALIAS",
    type_alias_declaration: "TYPE_ALIAS",
    export: "FUNCTION", // will be refined by content
    export_declaration: "FUNCTION",
  };

  return map[entityType] ?? "FUNCTION";
}

/**
 * Extracts JSDoc / block comments immediately above a line.
 * Walks up from lineIndex looking for comment lines.
 */
function extractDocString(lines: string[], lineIndex: number): string | null {
    if(lineIndex <= 0) return null;
    
    const commentLines: string[] = [];
    let i = lineIndex-1;

    // skip blank lines between comment and entity
    while(i >= 0 && lines[i]!.trim() === "") {
        i--;
    }

    // Check if we're in block comment
    if(i >=0 && lines[i]!.trim().endsWith("*/")) {
        // Walk back to find the start
        while (i >= 0 && !lines[i]!.trim().startsWith("/*")) {
            commentLines.unshift(lines[i]!);
            i--;
        }
        if (i >= 0) {
            commentLines.unshift(lines[i]!);
        }
        return commentLines.join("\n").trim() || null;
    }

    // Check for single-line comments
    while (i >= 0 && lines[i]!.trim().startsWith("//")) {
        commentLines.unshift(lines[i]!);
        i--;
    }

    return commentLines.length > 0 ? commentLines.join("\n").trim() : null;
}

/**
 * Remove duplicate chunks (same file + startLine + endLine).
 * Can happen when export wraps a function declaration.
 * 
 * export function createUser() {} -> parsed as {function | export} entity
 */

function deduplicateChunks(chunks: CodeChunkInput[]) : CodeChunkInput[] {
    const seen = new Set<string>();
    return chunks.filter((chunk) => {
        const key = `${chunk.filePath}:${chunk.startLine}:${chunk.endLine}`;
        if(seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ─── Token estimation ─────────────────────────────────────────
// Rough estimate: 1 token ≈ 4 chars for code
export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export function totalChunkTokens(chunks: CodeChunkInput[]): number {
    return chunks.reduce((sum, c) => sum + estimateTokens(c.rawCode), 0);
}