import { FileTree, sourceFile, FolderNode } from "@/types/gitWhiz";

// --- FUNCTION to build the tree ---
const buildFileTree = (files: sourceFile[]): FileTree => {
  const root: FileTree = {};

  let currentLevel = root;

  files.forEach((file) => {
    const pathParts = file.fileName.split("/");

    pathParts.forEach((part, index) => {
      const isFile = index === pathParts.length - 1;

      if (isFile) {
        currentLevel[part] = {
          type: "file",
          name: part,
          ...file,
        };
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            type: "folder",
            name: part,
            children: {},
          };
        }

        currentLevel = (currentLevel[part] as FolderNode).children;
      }
    });

    currentLevel = root;
  });
  return root;
};

export default buildFileTree;
