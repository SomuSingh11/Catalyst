import {
  FileMetrics,
  ParsedEntity,
  ParseResult,
  SupportedLanguageId,
  SyntaxNode,
} from "@/types/parser";
import { createParser } from "./parser-registry";
import { EcmaScriptAnalyzer } from "../analyzer_modules/ecmaScript-analyzer";

const LANGUAGE_MAP: Record<SupportedLanguageId, string> = {
  javascript: "javascript",
  jsx: "javascript",
  typescript: "typescript",
  tsx: "typescript",
  python: "python",
  c: "c",
  cpp: "cpp",
  csharp: "c-sharp",
  rust: "rust",
  go: "go",
  java: "java",
  vba: "vba",
};

function detectLanguageFromPath(filePath: string): SupportedLanguageId {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "ts":
    case "mts":
    case "cts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "jsx":
      return "jsx";
    case "py":
    case "pyi":
    case "pyw":
      return "python";
    case "c":
      return "c";
    case "cpp":
    case "cxx":
    case "cc":
    case "h":
    case "hpp":
      return "cpp";
    case "cs":
    case "c#":
      return "csharp";
    case "go":
      return "go";
    case "java":
      return "java";
    case "rs":
      return "rust";
    case "vba":
    case "bas":
    case "cls":
      return "vba";
    default:
      return "javascript";
  }
}

export class TreeSitterParser {
  private defaultAnalyzer = new EcmaScriptAnalyzer();

  async parse(filePath: string, content: string): Promise<ParseResult> {
    const startTime = Date.now();
    const languageId = detectLanguageFromPath(filePath);

    const factoryLangKey = LANGUAGE_MAP[languageId];
    const parser = await createParser(factoryLangKey);

    try {
      const syntaxTree = parser.parse(content);

      let entities: ParsedEntity[] = [];
      let metrics: FileMetrics | undefined = undefined;

      if (this.defaultAnalyzer) {
        entities = await this.defaultAnalyzer.analyze(
          syntaxTree?.rootNode as SyntaxNode,
          content
        );
        metrics = this.defaultAnalyzer.getMetrics(
          syntaxTree?.rootNode as SyntaxNode,
          content
        );
      }

      parser.delete();

      const result: ParseResult = {
        filePath,
        language: languageId,
        entities: entities.map((e) => ({ ...e, language: languageId })),
        metrics,
        timestamp: Date.now(),
        parseTimeMs: Date.now() - startTime,
      };

      return result;
    } catch (error: unknown) {
      console.error(`Error parsing file ${filePath}:`, error);
      throw error;
    }
  }
}
