export type Project = {
  name: string;
  githubUrl: string;
  githubToken: string | null;
  id: string;
  createAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
