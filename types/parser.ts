export const SUPPORTED_LANGUAGE_IDS = [
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "python",
  "c",
  "cpp",
  "csharp",
  "rust",
  "go",
  "java",
  "vba",
] as const;
export type SupportedLanguageId = (typeof SUPPORTED_LANGUAGE_IDS)[number];

export type SyntaxNode = {
  type: string;
  text: string;
  id: number;

  startPosition: { row: number; column: number };
  endPosition: { row: number; column: number };
  startIndex: number;
  endIndex: number;

  parent: SyntaxNode | null;
  children: SyntaxNode[];
  namedChildren: SyntaxNode[];

  nextSibling: SyntaxNode | null;
  previousSibling: SyntaxNode | null;
  nextNamedSibling: SyntaxNode | null;
  previousNamedSibling: SyntaxNode | null;

  child: (index: number) => SyntaxNode | null;
  descendantsOfType?: (type: string | string[]) => SyntaxNode[];
};

export interface EntityRelationship {
  from: string;
  to: string;
  type:
    | "inherits"
    | "implements"
    | "overrides"
    | "calls"
    | "imports"
    | "decorates"
    | "contains"
    | "references"
    | "embeds"
    | "member_of";

  sourceFile?: string;
  targetFile?: string;

  metadata?: {
    line?: number;
    confidence?: number;
    isDirectRelationship?: boolean;
    mroPosition?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface ParsedEntity {
  name: string;
  path?: string;
  signature?: string;

  type:
    | "function"
    | "async_function"
    | "generator"
    | "class"
    | "method"
    | "class_method"
    | "static_method"
    | "constructor"
    | "variable"
    | "constant"
    | "property"
    | "import"
    | "export"
    | "interface"
    | "type"
    | "enum"
    | "decorator"
    | "abstract_method"
    | "jsx_element"
    | "jsx_fragment"
    | "jsx_attribute";

  filePath?: string;
  location?: {
    start: { line: number; column: number; index: number };
    end: { line: number; column: number; index: number };
  };

  language?: string;
  children?: ParsedEntity[] /** Child entities (e.g., methods in a class) */;
  references?: string[];
  modifiers?: string[];

  parameters?: Array<{
    name: string;
    type?: string;
    optional?: boolean;
    defaultValue?: string;
  }>;

  importData?: {
    source: string;
    specifiers: Array<{ local: string; imported?: string; alias?: string }>;
    isDefault?: boolean;
    isNamespace?: boolean;
    isRelative?: boolean;
    fromModule?: string;
    defaultImportName?: string;
  };

  relationships?: Array<{
    type:
      | "inherits"
      | "implements"
      | "overrides"
      | "calls"
      | "imports"
      | "decorates"
      | "contains";
    target: string;
    targetFile?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
  }>;
}

export interface ParseResult {
  filePath: string;
  language: SupportedLanguageId;
  entities: ParsedEntity[];
  metrics?: FileMetrics;
  timestamp: number;
  parseTimeMs: number;
}

export interface FileMetrics {
  loc: number;
  functionCount: number;
  classCount: number;
  loopsCount: number;
  conditionalsCount: number;
  jsxElementCount: number;
  complexity: number;
}
