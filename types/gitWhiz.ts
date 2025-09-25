import { Prisma } from "@prisma/client";

export type Project = {
  name: string;
  githubUrl: string;
  githubToken: string | null;
  id: string;
  createAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type WhizSavedQuestion = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  question: string;
  answer: string;

  filesReferences: Prisma.JsonValue | null;

  whizProjectId: string;
  userId: string;
};

export type sourceFile = {
  id: string;
  sourceCode: string;
  fileName: string;
  summary: string | null;
  whizProjectId: string;
};

// File tree structure (for representing the directory structure of a project)
export type FileNode = sourceFile & {
  type: "file";
  name: string;
};

export type FolderNode = {
  type: "folder";
  name: string;
  children: FileTree;
};

export type FileTree = {
  [key: string]: FileNode | FolderNode;
};

// Tracking status of Project indexing process
export interface IndexingProgress {
  status:
    | "initialising"
    | "cloning"
    | "processing"
    | "saving"
    | "completed"
    | "pending"
    | "idle"
    | "connected"
    | "error";
  message: string;
  current?: number;
  total?: number;
  currentFile?: string;
  percentage?: number;
  error?: string;
  stats?: {
    totalFiles: number;
    embeddingsGenerated: number;
    savedToDatabase: number;
    failed: number;
    processingTimeSeconds: number;
  } | null;
}
