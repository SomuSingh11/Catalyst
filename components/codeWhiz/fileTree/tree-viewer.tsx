import {
  FileIcon,
  FolderIcon,
} from "@/components/utilities/code-whiz-fileicon";
import { FileNode, FileTree } from "@/types/gitWhiz";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

// --- RECURSIVE COMPONENT for rendering the tree ---
interface FileTreeProps {
  tree: FileTree;
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
  level?: number;
}

const FileTreeView = ({
  tree,
  onFileSelect,
  selectedFileId,
  level = 0,
}: FileTreeProps) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  };

  const sortedEntries = Object.values(tree).sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="font-display font-normal">
      {sortedEntries.map((node) => {
        const isFolderOpen = openFolders[node.name];

        if (node.type === "folder") {
          return (
            <div key={node.name} style={{ marginLeft: `${level * 10}px` }}>
              <div
                className="flex items-center p-1 cursor-pointer rounded-md hover:bg-gray-300/50"
                onClick={() => toggleFolder(node.name)}
              >
                <div className="flex items-center justify-center w-4 h-4 mr-1">
                  {isFolderOpen ? (
                    <ChevronDown className="text-gray-400 w-4 h-4" />
                  ) : (
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  )}
                </div>

                {/* Folder icon */}
                <div className="mr-2">
                  <FolderIcon isOpen={isFolderOpen} />
                </div>
                <span className="ml-1">{node.name}</span>
              </div>

              {isFolderOpen && (
                <div className="ml-3 border-l border-gray-600/15">
                  <FileTreeView
                    tree={node.children}
                    onFileSelect={onFileSelect}
                    selectedFileId={selectedFileId}
                    level={level + 1}
                  />
                </div>
              )}
            </div>
          );
        } else {
          const isSelected = selectedFileId === node.id;
          return (
            <div
              key={node.id}
              style={{ marginLeft: `${level * 10 + 21}px` }}
              className={`flex items-center p-1 cursor-pointer font-light rounded-md hover:bg-gray-300/50  ${
                isSelected ? "bg-gray-300/30" : ""
              }`}
              onClick={() => onFileSelect(node)}
            >
              <FileIcon fileName={node.name} />
              <span className="ml-2">{node.name}</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default FileTreeView;
