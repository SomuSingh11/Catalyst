import { GitBranch } from "lucide-react";
import { Node, Edge } from "reactflow";

interface DependencyCardProps {
  node: Node;
  edge?: Edge;
}

export const DependencyCard = ({ node, edge }: DependencyCardProps) => {
  const symbols = edge?.data?.symbols || [];
  const isExternal = edge?.data?.relationshipType === "external";

  return (
    <div
      className={`p-3 rounded-lg text-sm border transition-all hover:shadow-md ${
        isExternal
          ? "bg-red-50 border-red-200 hover:bg-red-100"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-start gap-2">
        <GitBranch
          size={14}
          className={`mt-0.5 ${isExternal ? "text-red-600" : "text-gray-600"}`}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 break-words">
            {node.data.label}
          </div>
          <div className="text-xs text-gray-500 truncate mt-0.5">{node.id}</div>
          {isExternal && (
            <span className="inline-block mt-1 text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
              External
            </span>
          )}
          {symbols.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Imported symbols:
              </div>
              <div className="flex flex-wrap gap-1">
                {symbols.slice(0, 5).map((symbol: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-white text-gray-700 px-1.5 py-0.5 rounded border border-gray-300 font-mono"
                  >
                    {symbol}
                  </span>
                ))}
                {symbols.length > 5 && (
                  <span className="text-xs text-gray-500 px-1.5 py-0.5">
                    +{symbols.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
