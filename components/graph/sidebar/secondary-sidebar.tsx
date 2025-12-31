import { Node, Edge } from "reactflow";
import {
  FileCode,
  ArrowDownCircle,
  ArrowUpCircle,
  Box,
  GitBranch,
  AlertCircle,
} from "lucide-react";
import { ParsedEntity } from "@/types/parser";
import { DependencyCard } from "./dependency-card";
import { EntityCard } from "./entity-card";
import { ImportCard } from "./import-card";
import { CollapsibleSection } from "./collapsibleSection";
import { MetricCard } from "./metric-card";
import { Header } from "./secondary-header";
import { ExportCard } from "./export-card";

interface SecondarySidebarProps {
  selectedNode: Node | null;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
  isOpen: boolean;
}

export function SecondarySidebar({
  selectedNode,
  nodes,
  edges,
  onClose,
  isOpen,
}: SecondarySidebarProps) {
  if (!isOpen || !selectedNode) return null;

  const data = selectedNode.data;
  const details = data.details || {};

  const incomingEdges = edges.filter((edge) => edge.target === selectedNode.id);
  const incomingNodes = incomingEdges
    .map((edge) => ({ node: nodes.find((n) => n.id === edge.source), edge }))
    .filter(({ node }) => node) as { node: Node; edge: Edge }[];

  const outgoingEdges = edges.filter((edge) => edge.source === selectedNode.id);
  const outgoingNodes = outgoingEdges
    .map((edge) => ({ node: nodes.find((n) => n.id === edge.target), edge }))
    .filter(({ node }) => node) as { node: Node; edge: Edge }[];

  const imports = (details.imports || []) as ParsedEntity[];
  const exports = (details.exports || []) as ParsedEntity[];
  const entities = (details.entities || []) as ParsedEntity[];
  const metrics = details.metrics || {};

  // Group entities by type
  const entityGroups = entities.reduce((acc, entity) => {
    const type = entity.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(entity);
    return acc;
  }, {} as Record<string, ParsedEntity[]>);

  return (
    <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden shadow-2xl rounded-l-xl">
      {/* Header */}
      <Header selectedNode={selectedNode} onClose={onClose} />

      <div className="flex-1 overflow-y-auto">
        {/* Metrics Section */}
        <CollapsibleSection
          title="Code Metrics"
          icon={FileCode}
          iconColor="text-blue-600"
          defaultOpen={true}
        >
          <MetricCard metrics={metrics} />
        </CollapsibleSection>

        {/* Entities Section */}
        {Object.keys(entityGroups).length > 0 && (
          <CollapsibleSection
            title="Code Entities"
            icon={Box}
            count={entities.length}
            iconColor="text-purple-600"
            defaultOpen={false}
          >
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(entityGroups).map(([type, items]) => (
                <div key={type}>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    {type.replace(/_/g, " ")} ({items.length})
                  </div>
                  <div className="space-y-2">
                    {items.map((entity, idx) => (
                      <EntityCard key={idx} entity={entity} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Imports Section */}
        <CollapsibleSection
          title="Imports"
          icon={ArrowDownCircle}
          count={imports.length}
          iconColor="text-indigo-600"
          defaultOpen={false}
        >
          {imports.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {imports.map((imp, idx) => (
                <ImportCard key={idx} imp={imp} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic flex items-center gap-2">
              <AlertCircle size={14} />
              No imports found
            </div>
          )}
        </CollapsibleSection>

        {/* Exports Section */}
        <CollapsibleSection
          title="Exports"
          icon={ArrowUpCircle}
          count={exports.length}
          iconColor="text-emerald-600"
          defaultOpen={false}
        >
          {exports.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {exports.map((exp, idx) => (
                <ExportCard key={idx} entity={exp} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic flex items-center gap-2">
              <AlertCircle size={14} />
              No exports found
            </div>
          )}
        </CollapsibleSection>

        {/* Dependencies Section */}
        <CollapsibleSection
          title="Dependencies"
          icon={GitBranch}
          count={outgoingNodes.length}
          iconColor="text-blue-600"
          defaultOpen={false}
        >
          {outgoingNodes.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {outgoingNodes.map(({ node, edge }) => (
                <DependencyCard key={node.id} node={node} edge={edge} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic flex items-center gap-2">
              <AlertCircle size={14} />
              No dependencies
            </div>
          )}
        </CollapsibleSection>

        {/* Dependents Section */}
        <CollapsibleSection
          title="Used By"
          icon={GitBranch}
          count={incomingNodes.length}
          iconColor="text-violet-600"
          defaultOpen={false}
        >
          {incomingNodes.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {incomingNodes.map(({ node, edge }) => (
                <DependencyCard key={node.id} node={node} edge={edge} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic flex items-center gap-2">
              <AlertCircle size={14} />
              Not used by any files
            </div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
}
