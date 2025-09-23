"use client";

import buildFileTree from "@/components/codeWhiz/fileTree/build-tree";
import FileTreeView from "@/components/codeWhiz/fileTree/tree-viewer";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { FileNode } from "@/types/gitWhiz";
import React, { useMemo } from "react";

function AnalyzerPage() {
  const [selectedFile, setSelectedFile] = React.useState<FileNode | null>(null);

  const { projectId } = useProject();
  const { data: sourceFiles } = api.whizProject.getSourceFiles.useQuery({
    projectId,
  });

  const fileTree = useMemo(() => {
    if (!sourceFiles) return {};
    return buildFileTree(sourceFiles);
  }, [sourceFiles]);

  const handleFileSelect = (node: FileNode) => {
    setSelectedFile(node);
  };

  return (
    <div>
      <FileTreeView
        tree={fileTree}
        onFileSelect={handleFileSelect}
        selectedFileId={selectedFile?.id || null}
      />
    </div>
  );
}

export default AnalyzerPage;
