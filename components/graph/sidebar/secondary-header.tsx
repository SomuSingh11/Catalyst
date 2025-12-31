import { ParsedEntity } from "@/types/parser";
import { Code2, FileCode, Layers, X } from "lucide-react";
import { Node } from "reactflow";

interface HeaderProps {
  selectedNode: Node;
  onClose: () => void;
}

export const Header = ({ selectedNode, onClose }: HeaderProps) => {
  const data = selectedNode.data;
  const details = data.details || {};
  const entities = (details.entities || []) as ParsedEntity[];
  return (
    <div className="p-5 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-2">
            <FileCode size={20} />
            <h3 className="font-bold text-xl">{data.label}</h3>
          </div>
          <p className="text-xs text-blue-100 break-all font-mono bg-blue-700 bg-opacity-30 px-2 py-1 rounded">
            {details.fullPath || selectedNode.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-600 rounded-lg p-2 -mt-1 transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {details.language && (
          <span className="inline-flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-semibold">
            <Code2 size={12} />
            {details.language.toUpperCase()}
          </span>
        )}
        <span className="inline-flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-semibold">
          <Layers size={12} />
          {entities.length} Entities
        </span>
      </div>
    </div>
  );
};
