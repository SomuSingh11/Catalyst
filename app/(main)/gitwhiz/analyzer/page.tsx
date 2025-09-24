"use client";

import React, { useMemo } from "react";

import buildFileTree from "@/components/codeWhiz/fileTree/build-tree";
import FileTreeView from "@/components/codeWhiz/fileTree/tree-viewer";

import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";

import { FileNode } from "@/types/gitWhiz";

import { ChevronDown, SidebarClose, SidebarOpen } from "lucide-react";
import AnalyzerTab from "@/components/codeWhiz/analyzer/analyzer-tab";
import FileTreeSkeleton from "@/components/utilities/filetree-skeleton";

function AnalyzerPage() {
  const [selectedFile, setSelectedFile] = React.useState<FileNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const { projectId, project } = useProject();
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
    <div className="flex h-full w-full">
      <div>
        <aside
          className={`h-full overflow-y-auto bg-sidebar border border-gray-300 rounded-md transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-80 p-2" : "w-0"
          }`}
        >
          <p className="pb-2 font-display flex items-center text-lg gap-2 border-b">
            <ChevronDown className="text-gray-400 h-4 w-4" />
            {project?.name || "Project"}
          </p>
          <div className="pt-2">
            {Object.keys(fileTree).length === 0 ? (
              <FileTreeSkeleton />
            ) : (
              <FileTreeView
                tree={fileTree}
                onFileSelect={handleFileSelect}
                selectedFileId={selectedFile?.id || null}
              />
            )}
          </div>
        </aside>
      </div>

      <main className="flex-1 h-full flex flex-col relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1 left-2 z-10 p-2  rounded-md hover:bg-secondary/20 transition"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? (
            <SidebarClose className="size-5" />
          ) : (
            <SidebarOpen className="size-5" />
          )}
        </button>

        {selectedFile ? (
          <AnalyzerTab file={selectedFile} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a file to view its content.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AnalyzerPage;
