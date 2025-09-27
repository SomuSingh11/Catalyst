"use client";

import React, { useMemo } from "react";

import buildFileTree from "@/components/codeWhiz/fileTree/build-tree";
import FileTreeView from "@/components/codeWhiz/fileTree/tree-viewer";

import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";

import { FileNode } from "@/types/gitWhiz";

import {
  ArrowLeft,
  ChevronDown,
  SidebarClose,
  SidebarOpen,
} from "lucide-react";
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

  const handleBackToSidebar = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex h-full w-full max-w-full overflow-hidden">
      <aside
        className={`
          h-full bg-white border-r border-gray-200 flex-col flex-shrink-0
          w-full md:w-auto 
          ${selectedFile ? "hidden md:flex" : "flex"}
          ${
            isSidebarOpen
              ? "md:min-w-80 md:max-w-80"
              : "md:w-0 md:min-w-0 md:max-w-0"
          }
          transition-all duration-300 ease-in-out overflow-hidden
        `}
      >
        <div
          className={`h-full flex flex-col ${
            isSidebarOpen ? "p-2" : "p-0"
          } transition-all duration-300`}
        >
          {isSidebarOpen && (
            <>
              <div className="pb-2 font-display flex items-center justify-between text-lg gap-2 border-b flex-shrink-0">
                <div className="flex items-center  gap-2">
                  <ChevronDown className="text-gray-400 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{project?.name || "Project"}</span>
                </div>
                {isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:block p-1 rounded-md hover:bg-gray-100 transition"
                    title="Collapse Sidebar"
                  >
                    <SidebarClose className="size-5" />
                  </button>
                )}
                <span className="md:hidden text-xs text-gray-500 whitespace-nowrap">
                  Tap file to preview
                </span>
              </div>
              <div className="pt-2 flex-1 overflow-auto min-h-0">
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
            </>
          )}
        </div>
      </aside>

      <main
        className={`
          h-full flex-1 flex-col relative min-w-0 max-w-full overflow-hidden
          ${selectedFile ? "flex" : "hidden md:flex"}
        `}
      >
        <div className="absolute top-3 left-2 z-10">
          {/* This button shows on mobile to go back to the file list */}
          <button
            onClick={handleBackToSidebar}
            className=" rounded-md  md:hidden hover:bg-secondary/20 transition bg-white shadow-sm"
            title="Back to File List"
          >
            <ArrowLeft className="size-6 text-green-900" />
          </button>
          {/* Desktop only Button */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className=" rounded-md hover:bg-secondary/20 transition bg-white shadow-sm"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <SidebarOpen className="size-6" />
            </button>
          )}
        </div>

        <div className="h-full overflow-hidden min-w-0 w-full">
          {selectedFile ? (
            <div className="h-full w-full overflow-hidden">
              <AnalyzerTab file={selectedFile} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full w-full">
              <p className="text-gray-500">
                Select a file to view its content.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AnalyzerPage;
