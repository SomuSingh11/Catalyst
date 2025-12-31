import type { FileMetrics, ParsedEntity, SyntaxNode } from "@/types/parser";

export class EcmaScriptAnalyzer {
  async analyze(node: SyntaxNode, sourceCode: string): Promise<ParsedEntity[]> {
    return this.extractEntities(node, sourceCode);
  }

  private async extractEntities(
    node: SyntaxNode,
    source: string,
    depth = 0,
    maxDepth = 20
  ): Promise<ParsedEntity[]> {
    if (depth > maxDepth) return [];

    const entities: ParsedEntity[] = [];

    switch (node.type) {
      // Functions
      case "function_declaration":
      case "function_expression":
      case "arrow_function":
      case "method_definition":
        entities.push(this.extractFunction(node, source));
        break;

      // Classes
      case "class_declaration":
      case "class_expression":
        entities.push(this.extractClass(node, source));
        break;

      // Types (TS)
      case "interface_declaration":
        entities.push(this.extractInterface(node));
        break;
      case "type_alias_declaration":
        entities.push(this.extractTypeAlias(node));
        break;

      // Imports
      case "import_statement":
      case "import_declaration":
        entities.push(this.extractImport(node));
        break;

      // Exports
      case "export_statement":
      case "export_declaration": {
        const exports = this.extractExport(node, source);
        if (exports) entities.push(...exports);
        break;
      }

      // Variables
      case "variable_declaration":
      case "lexical_declaration":
        entities.push(...this.extractVariables(node, source));
        break;
    }

    // Recursively handle children
    for (const child of node.namedChildren) {
      entities.push(
        ...(await this.extractEntities(child, source, depth + 1, maxDepth))
      );
    }

    return entities;
  }

  // ===========================================================================
  // EXTRACTOR MODULES
  // These methods convert raw Tree-Sitter nodes into structured ParsedEntity objects.
  // ===========================================================================

  /**
   * Parses import statements to extract the source module and all imported symbols.
   * Handles three main patterns:
   * 1. Default imports: `import React from 'react'`
   * 2. Named imports (with aliasing): `import { useState as useStateHook } from 'react'`
   * 3. Namespace imports: `import * as fs from 'fs'`
   *
   * @param node - The `import_statement` or `import_declaration` syntax node.
   */

  private extractImport(node: SyntaxNode): ParsedEntity {
    const sourceNode = this.findChildByType(node, "string");
    const importSource = sourceNode?.text?.slice(1, -1) || "";

    const specifiers: Array<{ local: string; imported?: string }> = [];
    let defaultImportName: string | undefined;

    const importClause = this.findChildByType(node, "import_clause");

    const childrenToScan = importClause
      ? importClause.children
      : node.namedChildren;

    for (const child of childrenToScan) {
      if (child.type === "identifier") {
        defaultImportName = child.text;
      } else if (child.type === "named_imports") {
        for (const spec of child.namedChildren) {
          if (spec.type === "import_specifier") {
            const nameNode =
              this.findChildByType(spec, "name") || spec.namedChildren[0];
            const aliasNode = this.findChildByType(spec, "alias");

            const actualAlias =
              aliasNode ||
              (spec.namedChildren.length > 1 ? spec.namedChildren[1] : null);

            const imported = nameNode?.text;
            const local = actualAlias?.text || imported;

            if (imported) specifiers.push({ local: local!, imported });
          }
        }
      } else if (child.type === "namespace_import") {
        const id = this.findChildByType(child, "identifier");
        if (id) defaultImportName = id.text;
      }
    }

    return {
      name: importSource,
      type: "import",
      location: this.convertPosition(node),
      importData: {
        source: importSource,
        specifiers,
        isDefault: !!defaultImportName,
        defaultImportName,
      },
    };
  }

  /**
   * Identifies and parses export statements.
   * This is complex because exports can wrap other definitions.
   *
   * Strategies:
   * 1. Re-exports: `export { foo } from './bar'` (treated as an edge to another file).
   * 2. Default Exports: `export default class ...`
   * 3. Inline Exports: `export const a = 1` (Extracts the entity and adds 'export' modifier).
   *
   * @returns An array because a single `export { a, b }` statement produces multiple entities.
   */

  private extractExport(
    node: SyntaxNode,
    source: string
  ): ParsedEntity[] | null {
    const results: ParsedEntity[] = [];
    const position = this.convertPosition(node);

    // 1. Check for Re-Exports: "export { foo } from 'bar'"
    const sourceNode = this.findChildByType(node, "string");
    if (sourceNode) {
      const importSource = sourceNode.text.slice(1, -1);
      results.push({
        name: importSource,
        type: "import",
        location: position,
        importData: { source: importSource, specifiers: [], isDefault: false },
      });
    }

    // 2. Check for Default Export
    const isDefault = node.children.some((c) => c.type === "default");
    if (isDefault) {
      const signature = source.substring(
        position.start.index,
        Math.min(position.end.index, position.start.index + 200)
      );
      results.push({
        name: "default",
        type: "export",
        location: position,
        signature: signature.trim(),
      });
      return results;
    }

    // 3. Check for Export Clause: "export { A, B }"
    const exportClause = this.findChildByType(node, "export_clause");
    if (exportClause) {
      results.push({
        name: source.substring(exportClause.startIndex, exportClause.endIndex),
        type: "export",
        location: position,
      });
      return results;
    }

    // 4. Check for Declaration Exports: "export const x = 1"
    const declaration = node.namedChildren.find(
      (c) => c.type.includes("declaration") || c.type.includes("expression")
    );

    if (declaration) {
      let entity: ParsedEntity | null = null;
      switch (declaration.type) {
        case "function_declaration":
        case "function_expression":
          entity = this.extractFunction(declaration, source);
          break;
        case "class_declaration":
          entity = this.extractClass(declaration, source);
          break;
        case "variable_declaration":
        case "lexical_declaration":
          entity = this.extractVariables(declaration, source)[0] || null;
          break;
        case "interface_declaration":
          entity = this.extractInterface(declaration);
          break;
        case "type_alias_declaration":
          entity = this.extractTypeAlias(declaration);
          break;
      }

      if (entity) {
        return [
          {
            ...entity,
            modifiers: [...(entity.modifiers || []), "export"],
            type: "export",
          },
          ...results,
        ];
      }
    }

    return results.length > 0 ? results : null;
  }

  /**
   * Extracts function details, including methods and arrow functions.
   *
   * Key Features:
   * - **Signature Extraction**: Captures the function header for display.
   * - **Deep Analysis**: Triggers `extractCalls` to build the internal dependency graph.
   * - **Modifiers**: Detects `async`, `generator`, and `static` (via parent context).
   */

  private extractFunction(node: SyntaxNode, source: string): ParsedEntity {
    const nameNode =
      this.findChildByType(node, "identifier") ||
      this.findChildByType(node, "property_identifier");

    const name = nameNode?.text || "<anonymous>";

    const modifiers: string[] = [];
    const textStart = source.substring(node.startIndex, node.startIndex + 20); // Check first 20 chars
    if (textStart.includes("async")) modifiers.push("async");
    if (
      node.type === "generator_function" ||
      source.substring(node.startIndex, node.endIndex).includes("function*")
    ) {
      modifiers.push("generator");
    }

    const parameters = this.extractParameters(node);
    const position = this.convertPosition(node);

    const bodyStart = source.indexOf("{", position.start.index);
    const signature = source
      .substring(
        position.start.index,
        bodyStart > -1
          ? bodyStart
          : Math.min(position.end.index, position.start.index + 100)
      )
      .trim();

    const bodyNode = this.findChildByType(node, "statement_block");
    let relationships: ParsedEntity["relationships"] = [];
    let complexity = 1;

    if (bodyNode) {
      relationships = this.extractCalls(bodyNode);
      complexity = this.calculateFunctionComplexity(bodyNode);
    }

    return {
      name,
      type: node.parent?.type === "method_definition" ? "method" : "function",
      location: position,
      modifiers,
      parameters,
      signature,
      relationships,
      complexity,
    };
  }

  private extractCalls(bodyNode: SyntaxNode): ParsedEntity["relationships"] {
    const relationships: ParsedEntity["relationships"] = [];

    const callExpressions = this.findAllChildrenByType(
      bodyNode,
      "call_expression"
    );

    for (const callExpr of callExpressions) {
      const functionNode =
        this.findChildByType(callExpr, "identifier") ||
        this.findChildByType(callExpr, "member_expression");
      if (functionNode) {
        let targetName = functionNode.text;
        // For member expressions, get full dotted name
        if (functionNode.type === "member_expression") {
          targetName = functionNode.text;
        }
        relationships.push({
          type: "calls",
          target: targetName,
          metadata: {
            line: callExpr.startPosition.row + 1,
          },
        });
      }
    }
    return relationships;
  }

  /**
   * Extracts class definitions, methods, and inheritance data.
   *
   * Populates `relationships` with:
   * - `inherits`: The parent class (extends).
   * - `implements`: Interfaces implemented (TypeScript/Java).
   */

  private extractClass(node: SyntaxNode, source: string): ParsedEntity {
    const nameNode = this.findChildByType(node, "identifier");
    const name = nameNode?.text || "<anonymous>";

    const relationships: ParsedEntity["relationships"] = [];

    const heritage = this.findChildByType(node, "class_heritage");

    if (heritage) {
      const extendsClause = this.findChildByType(heritage, "extends_clause");
      if (extendsClause) {
        const parentClass = extendsClause.namedChildren[0]?.text;
        if (parentClass) {
          relationships.push({
            type: "inherits",
            target: parentClass,
          });
        }
      }

      const implementsClause = this.findChildByType(
        heritage,
        "implements_clause"
      );
      if (implementsClause) {
        for (const child of implementsClause.namedChildren) {
          if (child.type === "identifier" || child.type === "type_identifier") {
            relationships.push({
              type: "implements",
              target: child.text,
            });
          }
        }
      }
    }

    const children: ParsedEntity[] = [];
    const bodyNode = this.findChildByType(node, "class_body");

    if (bodyNode) {
      for (const child of bodyNode.namedChildren) {
        if (
          child.type === "method_definition" ||
          child.type === "function_declaration"
        ) {
          children.push(this.extractFunction(child, source));
        }
      }
    }

    return {
      name,
      type: "class",
      location: this.convertPosition(node),
      children,
      relationships,
    };
  }

  private extractInterface(node: SyntaxNode): ParsedEntity {
    const nameNode =
      this.findChildByType(node, "type_identifier") ||
      this.findChildByType(node, "identifier");
    return {
      name: nameNode?.text || "<anonymous>",
      type: "interface",
      location: this.convertPosition(node),
    };
  }

  private extractTypeAlias(node: SyntaxNode): ParsedEntity {
    const nameNode =
      this.findChildByType(node, "type_identifier") ||
      this.findChildByType(node, "identifier");
    return {
      name: nameNode?.text || "<anonymous>",
      type: "type",
      location: this.convertPosition(node),
    };
  }

  private extractVariables(node: SyntaxNode, source: string): ParsedEntity[] {
    const entities: ParsedEntity[] = [];
    const declarators = this.findAllChildrenByType(node, "variable_declarator");

    for (const declarator of declarators) {
      const nameNode =
        this.findChildByType(declarator, "identifier") ||
        declarator.namedChildren[0];
      if (nameNode?.type === "identifier") {
        const isConst = source
          .substring(node.startIndex, node.startIndex + 5)
          .includes("const");
        entities.push({
          name: nameNode.text,
          type: isConst ? "constant" : "variable",
          location: this.convertPosition(declarator),
        });
      }
    }
    return entities;
  }

  private extractParameters(node: SyntaxNode): ParsedEntity["parameters"] {
    const params: NonNullable<ParsedEntity["parameters"]> = [];
    const paramList = this.findChildByType(node, "formal_parameters");

    if (!paramList) return params;

    for (const param of paramList.namedChildren) {
      if (param.type === "identifier") {
        params.push({ name: param.text, optional: false });
      } else if (param.type === "required_parameter") {
        const id = this.findChildByType(param, "identifier");
        if (id) params.push({ name: id.text, optional: false });
      } else if (param.type === "optional_parameter") {
        const name = param.child(0)?.text;
        if (name) params.push({ name, optional: true });
      }
    }
    return params;
  }

  // --- HELPERS ---

  /**
   * Safely finds the first named child of a specific type.
   * Adapted from the Reference Implementation's logic.
   */
  private findChildByType(node: SyntaxNode, type: string): SyntaxNode | null {
    if (!node.namedChildren) return null;
    return node.namedChildren.find((c) => c.type === type) || null;
  }

  /**
   * Finds all descendants of a specific type (shallow or deep depending on implementation).
   * Here we implement a shallow check on named children for performance,
   * or use descendantsOfType if available.
   */
  private findAllChildrenByType(node: SyntaxNode, type: string): SyntaxNode[] {
    // 1. FAST PATH: Use Native C++ implementation if available
    if (typeof node.descendantsOfType === "function") {
      return node.descendantsOfType(type);
    }

    // 2. SLOW PATH: Manual Recursive Fallback | Only runs if the native method is missing
    let results: SyntaxNode[] = [];
    for (const child of node.children) {
      if (child.type === type) {
        results.push(child);
      }
      // Recursively search children
      if (child.children.length > 0) {
        results = results.concat(this.findAllChildrenByType(child, type));
      }
    }
    return results;
  }

  private convertPosition(node: SyntaxNode) {
    return {
      start: {
        line: node.startPosition.row + 1,
        column: node.startPosition.column,
        index: node.startIndex,
      },
      end: {
        line: node.endPosition.row + 1,
        column: node.endPosition.column,
        index: node.endIndex,
      },
    };
  }

  public getMetrics(root: SyntaxNode, source: string): FileMetrics {
    let functionCount = 0;
    let classCount = 0;
    let loopsCount = 0;
    let conditionalsCount = 0;
    let jsxElementCount = 0;

    const functionComplexities: number[] = [];

    const traverse = (node: SyntaxNode) => {
      const type = node.type;
      if (
        type === "function_declaration" ||
        type === "function_expression" ||
        type === "arrow_function" ||
        type === "method_definition"
      ) {
        functionCount++;
        const bodyNode = this.findChildByType(node, "statement_block");
        if (bodyNode) {
          const fnComplexity = this.calculateFunctionComplexity(bodyNode);
          functionComplexities.push(fnComplexity);
        }
        return;
      }

      if (type === "class_declaration" || type === "class_expression") {
        classCount++;
      }

      if (
        type === "for_statement" ||
        type === "while_statement" ||
        type === "do_statement" ||
        type === "for_in_statement" ||
        type === "for_of_statement"
      ) {
        loopsCount++;
      }

      if (
        type === "if_statement" ||
        type === "switch_statement" ||
        type === "conditional_expression" ||
        type === "ternary_expression"
      ) {
        conditionalsCount++;
      }

      if (type === "binary_expression") {
        const operatorNode = node.children?.[1]?.text;
        if (operatorNode === "&&" || operatorNode === "||") {
          conditionalsCount++;
        }
      }

      if (type === "jsx_element" || type === "jsx_self_closing_element") {
        jsxElementCount++;
      }

      for (const child of node.children) {
        traverse(child);
      }
    };
    traverse(root);

    const avgComplexity =
      functionComplexities.length > 0
        ? functionComplexities.reduce((a, b) => a + b, 0) /
          functionComplexities.length
        : 1;

    const maxComplexity =
      functionComplexities.length > 0 ? Math.max(...functionComplexities) : 1;

    const highComplexityCount = functionComplexities.filter(
      (c) => c >= 10
    ).length;

    return {
      loc: source.split("\n").length,
      functionCount,
      classCount,
      loopsCount,
      conditionalsCount,
      jsxElementCount,
      complexity: Math.round(avgComplexity),
      maxComplexity,
      highComplexityFunctions: highComplexityCount,
    };
  }

  /**
   * Calculates cyclomatic complexity for a single function.
   * Based on McCabe's formula: complexity = 1 + (decision points)
   */
  private calculateFunctionComplexity(bodyode: SyntaxNode): number {
    let complexity = 1;

    const traverse = (node: SyntaxNode) => {
      const type = node.type;

      if (
        type === "for_statement" ||
        type === "while_statement" ||
        type === "do_statement" ||
        type === "for_in_statement" ||
        type === "for_of_statement"
      ) {
        complexity++;
      }

      if (
        type === "if_statement" ||
        type === "conditional_expression" ||
        type === "ternary_expression"
      ) {
        complexity++;
      }

      if (type === "switch_case" && node.children.some((c) => c.type !== ":")) {
        complexity++;
      }

      if (type === "binary_expression") {
        const operator = node.children?.[1]?.text;
        if (operator === "&&" || operator === "||") {
          complexity++;
        }
      }

      if (type === "catch_clause") {
        complexity++;
      }

      for (const child of node.children) {
        traverse(child);
      }
    };

    traverse(bodyode);
    return complexity;
  }
}
