"use client";

import { Node, Edge } from "reactflow";

interface FileDetailsPanelProps {
  selectedNode: Node | null;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

export function FileDetailsPanel({
  selectedNode,
  nodes,
  edges,
  onClose,
}: FileDetailsPanelProps) {
  if (!selectedNode) return null;

  // Find incoming dependencies (files that import this file)
  const incomingEdges = edges.filter((edge) => edge.target === selectedNode.id);
  const incomingNodes = incomingEdges
    .map((edge) => nodes.find((n) => n.id === edge.source))
    .filter(Boolean) as Node[];

  // Find outgoing dependencies (files this file imports)
  const outgoingEdges = edges.filter((edge) => edge.source === selectedNode.id);
  const outgoingNodes = outgoingEdges
    .map((edge) => nodes.find((n) => n.id === edge.target))
    .filter(Boolean) as Node[];

  const data = selectedNode.data;

  return (
    <div className="absolute top-4 left-4 w-96 bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-start">
        <div className="flex-1 pr-2">
          <h3 className="font-bold text-lg mb-1">{data.label}</h3>
          <p className="text-xs text-blue-100 break-all">{data.fullPath}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-600 rounded p-1 transition-colors"
          title="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File Statistics */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📊</span>
            File Statistics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.functions !== undefined && (
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-gray-600">Functions</div>
                <div className="font-semibold text-blue-600">
                  {data.functions}
                </div>
              </div>
            )}
            {data.classes !== undefined && (
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-gray-600">Classes</div>
                <div className="font-semibold text-purple-600">
                  {data.classes}
                </div>
              </div>
            )}
            {data.types !== undefined && (
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600">Types</div>
                <div className="font-semibold text-green-600">{data.types}</div>
              </div>
            )}
            {data.constants !== undefined && (
              <div className="bg-orange-50 p-2 rounded">
                <div className="text-gray-600">Constants</div>
                <div className="font-semibold text-orange-600">
                  {data.constants}
                </div>
              </div>
            )}
            {data.imports !== undefined && (
              <div className="bg-indigo-50 p-2 rounded">
                <div className="text-gray-600">Imports</div>
                <div className="font-semibold text-indigo-600">
                  {data.imports}
                </div>
              </div>
            )}
            {data.exports !== undefined && (
              <div className="bg-pink-50 p-2 rounded">
                <div className="text-gray-600">Exports</div>
                <div className="font-semibold text-pink-600">
                  {data.exports}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dependencies (Files this file imports) */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📥</span>
            Dependencies ({outgoingNodes.length})
          </h4>
          {outgoingNodes.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {outgoingNodes.map((node) => {
                const edge = outgoingEdges.find((e) => e.target === node.id);
                return (
                  <div
                    key={node.id}
                    className="bg-gray-50 p-2 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-800">
                      {node.data.label}
                    </div>
                    {edge?.label && (
                      <div className="text-xs text-gray-500 mt-1">
                        imports: {edge.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No dependencies
            </div>
          )}
        </div>

        {/* Dependents (Files that import this file) */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📤</span>
            Used By ({incomingNodes.length})
          </h4>
          {incomingNodes.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {incomingNodes.map((node) => {
                const edge = incomingEdges.find((e) => e.source === node.id);
                return (
                  <div
                    key={node.id}
                    className="bg-gray-50 p-2 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-800">
                      {node.data.label}
                    </div>
                    {edge?.label && (
                      <div className="text-xs text-gray-500 mt-1">
                        imports: {edge.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Not used by any files
            </div>
          )}
        </div>

        {/* Connection Summary */}
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">
            Connection Summary
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>
              • Imports from {outgoingNodes.length} file
              {outgoingNodes.length !== 1 ? "s" : ""}
            </div>
            <div>
              • Used by {incomingNodes.length} file
              {incomingNodes.length !== 1 ? "s" : ""}
            </div>
            <div>
              • Total connections: {incomingNodes.length + outgoingNodes.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}