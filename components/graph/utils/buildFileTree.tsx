import { useState } from "react";
import {
  FileIcon,
  FolderIcon,
} from "@/components/utilities/code-whiz-fileicon";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Node } from "reactflow";

interface FileTree {
  [key: string]: {
    type: "folder" | "file";
    name: string;
    node?: Node;
    children?: FileTree;
  };
}

interface FileTreeViewProps {
  tree: FileTree;
  selectedNode: Node | null;
  onFileSelect: (node: Node) => void;
  level?: number;
}

export function buildFileTreeFromNodes(nodes: Node[]): FileTree {
  const root: FileTree = {};

  let currentLevel = root;

  nodes.forEach((node) => {
    const pathParts = node.id.split("/");

    pathParts.forEach((part, index) => {
      const isFile = index === pathParts.length - 1;

      if (isFile) {
        currentLevel[part] = {
          type: "file",
          name: part,
          node: node,
        };
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            type: "folder",
            name: part,
            children: {},
          };
        }
        currentLevel = currentLevel[part].children!;
      }
    });

    currentLevel = root;
  });
  return root;
}

export function FileTreeView({
  tree,
  selectedNode,
  onFileSelect,
  level = 0,
}: FileTreeViewProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));

  const sorted = Object.values(tree).sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="font-sans">
      {sorted.map((entry) => {
        const isFolder = entry.type === "folder";
        const isOpen = openFolders[entry.name];

        if (isFolder) {
          return (
            <div key={entry.name} style={{ marginLeft: level * 12 }}>
              <div
                className="flex items-center gap-1 p-1 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => toggle(entry.name)}
              >
                {isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}

                <FolderIcon isOpen={isOpen} />
                <span className="font-medium">{entry.name}</span>
              </div>

              {isOpen && entry.children && (
                <div className="ml-4 border-l border-gray-300/40 pl-2">
                  <FileTreeView
                    tree={entry.children}
                    selectedNode={selectedNode}
                    onFileSelect={onFileSelect}
                    level={level + 1}
                  />
                </div>
              )}
            </div>
          );
        }

        const isSelected = selectedNode?.id === entry.node?.id;

        return (
          <div
            key={entry.node!.id}
            className={`flex items-center gap-2 p-1 cursor-pointer rounded hover:bg-gray-100 ${
              isSelected ? "bg-blue-100 text-blue-700 font-medium" : ""
            }`}
            style={{ marginLeft: level * 12 + 20 }}
            onClick={() => onFileSelect(entry.node!)}
          >
            <FileIcon fileName={entry.name} />
            <span>{entry.name}</span>
          </div>
        );
      })}
    </div>
  );
}
