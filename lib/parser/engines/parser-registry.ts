"use server";

import { Parser, Language } from "web-tree-sitter";
import path from "path";
import process from "process";
import fs from "fs";

let parserInitialized: Promise<void> | null = null;
const languageCache = new Map<string, Language>();

const getWasmPath = (fileName: string): string => {
  const projectRoot = path.resolve(process.cwd());
  return path.join(projectRoot, "public", "wasm", fileName);
};

export async function initializeParser(): Promise<void> {
  if (parserInitialized === null) {
    try {
      const coreWasmPath = getWasmPath("tree-sitter.wasm");
      const coreWasmBuffer = await fs.promises.readFile(coreWasmPath);
      parserInitialized = Parser.init(coreWasmBuffer);
      await parserInitialized;
    } catch (error) {
      console.error("Failed to initialize core parser:", error);
      parserInitialized = null;
      throw new Error("Failed to load core tree-sitter.wasm file.");
    }
  }
  return parserInitialized;
}

export async function getLanguage(language: string): Promise<Language> {
  await initializeParser();
  if (languageCache.has(language)) {
    return languageCache.get(language)!;
  }

  const langPath = getWasmPath(`tree-sitter-${language}.wasm`);

  try {
    const langWasmBuffer = await fs.promises.readFile(langPath);
    const loadedLanguage = await Language.load(langWasmBuffer);
    languageCache.set(language, loadedLanguage);
    return loadedLanguage;
  } catch (error) {
    console.error(
      `Failed to load grammar for '${language}' from path: ${langPath}`,
      error
    );
    throw new Error(`Unsupported language or grammar not found: ${language}`);
  }
}

export async function createParser(languageName: string): Promise<Parser> {
  await initializeParser();
  const lang = await getLanguage(languageName);
  const parser = new Parser();
  parser.setLanguage(lang);
  return parser;
}
