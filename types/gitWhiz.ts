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
