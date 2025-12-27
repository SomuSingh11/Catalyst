import { Node, Edge } from "reactflow";
import {
  X,
  FileCode,
  ArrowDownCircle,
  ArrowUpCircle,
  Box,
  Code2,
  Layers,
  GitBranch,
  Package,
  ChevronDown,
  ChevronRight,
  Zap,
  AlertCircle,
  FileType,
  Braces,
  Variable,
  FunctionSquare,
} from "lucide-react";
import { useState } from "react";

interface ParsedEntity {
  name: string;
  path?: string;
  signature?: string;
  type: string;
  filePath?: string;
  location?: {
    start: { line: number; column: number; index: number };
    end: { line: number; column: number; index: number };
  };
  language?: string;
  children?: ParsedEntity[];
  references?: string[];
  modifiers?: string[];
  parameters?: Array<{
    name: string;
    type?: string;
    optional?: boolean;
    defaultValue?: string;
  }>;
  importData?: {
    source: string;
    specifiers: Array<{ local: string; imported?: string; alias?: string }>;
    isDefault?: boolean;
    isNamespace?: boolean;
    isRelative?: boolean;
    fromModule?: string;
    defaultImportName?: string;
  };
  relationships?: Array<{
    type: string;
    target: string;
    targetFile?: string;
    metadata?: Record<string, any>;
  }>;
}

interface SecondarySidebarProps {
  selectedNode: Node | null;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
  isOpen: boolean;
}

// Entity icon mapping
const getEntityIcon = (type: string, size = 14) => {
  const iconMap: Record<string, any> = {
    function: FunctionSquare,
    async_function: Zap,
    class: Box,
    interface: FileType,
    type: Braces,
    variable: Variable,
    constant: Variable,
    enum: Layers,
  };
  const Icon = iconMap[type] || Code2;
  return <Icon size={size} />;
};

// Entity type color mapping
const getEntityColor = (type: string) => {
  const colorMap: Record<string, string> = {
    function: "text-blue-600 bg-blue-50 border-blue-200",
    async_function: "text-purple-600 bg-purple-50 border-purple-200",
    generator: "text-indigo-600 bg-indigo-50 border-indigo-200",
    class: "text-orange-600 bg-orange-50 border-orange-200",
    method: "text-cyan-600 bg-cyan-50 border-cyan-200",
    interface: "text-emerald-600 bg-emerald-50 border-emerald-200",
    type: "text-teal-600 bg-teal-50 border-teal-200",
    enum: "text-amber-600 bg-amber-50 border-amber-200",
    variable: "text-gray-600 bg-gray-50 border-gray-200",
    constant: "text-slate-600 bg-slate-50 border-slate-200",
  };
  return colorMap[type] || "text-gray-600 bg-gray-50 border-gray-200";
};

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  icon,
  count,
  children,
  defaultOpen = true,
  iconColor = "text-gray-600",
}: {
  title: string;
  icon: any;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  iconColor?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = icon;

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className={iconColor} />
          <h4 className="font-semibold text-gray-700">
            {title}
            {count !== undefined && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({count})
              </span>
            )}
          </h4>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="pb-4 px-4">{children}</div>}
    </div>
  );
};

// Entity Card Component
const EntityCard = ({ entity }: { entity: ParsedEntity }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = entity.children && entity.children.length > 0;

  return (
    <div
      className={`border rounded-lg overflow-hidden ${getEntityColor(
        entity.type
      )}`}
    >
      <div
        className="p-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {getEntityIcon(entity.type, 16)}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm flex items-center gap-2">
                {entity.name}
                {entity.modifiers && entity.modifiers.length > 0 && (
                  <span className="text-xs opacity-60">
                    [{entity.modifiers.join(", ")}]
                  </span>
                )}
              </div>
              {entity.signature && (
                <div className="text-xs font-mono mt-1 opacity-75 break-all">
                  {entity.signature.substring(0, 80)}
                  {entity.signature.length > 80 ? "..." : ""}
                </div>
              )}
              {entity.parameters && entity.parameters.length > 0 && (
                <div className="text-xs mt-1 opacity-70">
                  <span className="font-medium">Params:</span>{" "}
                  {entity.parameters.map((p, i) => (
                    <span key={i}>
                      {p.name}
                      {p.type ? `: ${p.type}` : ""}
                      {p.optional ? "?" : ""}
                      {i < entity.parameters!.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
              {entity.location && (
                <div className="text-xs mt-1 opacity-60">
                  Line {entity.location.start.line}:
                  {entity.location.start.column} → {entity.location.end.line}:
                  {entity.location.end.column}
                </div>
              )}
            </div>
          </div>
          {hasChildren && (
            <div className="text-xs opacity-60 flex items-center gap-1">
              {entity.children!.length}
              {expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nested Children */}
      {expanded && hasChildren && (
        <div className="bg-white bg-opacity-50 p-2 space-y-2 border-t">
          {entity.children!.map((child, idx) => (
            <EntityCard key={idx} entity={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// Import Card Component
const ImportCard = ({ imp }: { imp: ParsedEntity }) => {
  const importData = imp.importData;
  if (!importData) return null;

  return (
    <div className="bg-indigo-50 p-3 rounded-lg text-sm border border-indigo-200">
      <div className="flex items-start gap-2 mb-2">
        <Package size={14} className="text-indigo-600 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-indigo-900 break-all">
            {importData.source}
          </div>
          <div className="flex gap-2 mt-1">
            {importData.isRelative && (
              <span className="text-xs bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded">
                Relative
              </span>
            )}
            {importData.isDefault && (
              <span className="text-xs bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">
                Default
              </span>
            )}
            {importData.isNamespace && (
              <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                Namespace
              </span>
            )}
          </div>
        </div>
      </div>

      {importData.specifiers && importData.specifiers.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-xs font-semibold text-indigo-700">Imports:</div>
          <div className="flex flex-wrap gap-1">
            {importData.specifiers.map((spec, idx) => (
              <span
                key={idx}
                className="text-xs bg-white text-indigo-900 px-2 py-1 rounded border border-indigo-200 font-mono"
              >
                {spec.imported && spec.imported !== spec.local
                  ? `${spec.imported} as ${spec.local}`
                  : spec.local}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Dependency Node Card
const DependencyCard = ({
  node,
  edge,
  type,
}: {
  node: Node;
  edge?: Edge;
  type: "incoming" | "outgoing";
}) => {
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

  const complexityLevel =
    (metrics.complexity || 0) <= 5
      ? "Low"
      : (metrics.complexity || 0) <= 10
      ? "Medium"
      : "High";

  const complexityColor =
    (metrics.complexity || 0) <= 5
      ? "text-green-600"
      : (metrics.complexity || 0) <= 10
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="w-[480px] bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Header */}
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
            className="text-white hover:bg-blue-600 rounded-lg p-2 transition-colors"
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Metrics Section */}
        <CollapsibleSection
          title="Code Metrics"
          icon={FileCode}
          iconColor="text-blue-600"
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
              <div className="text-gray-600 text-xs font-semibold mb-1">
                Lines of Code
              </div>
              <div className="font-bold text-blue-700 text-2xl">
                {metrics.loc || 0}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
              <div className="text-gray-600 text-xs font-semibold mb-1">
                Complexity
              </div>
              <div className={`font-bold text-2xl ${complexityColor}`}>
                {metrics.complexity || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {complexityLevel}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
              <div className="text-gray-600 text-xs font-semibold mb-1">
                Functions
              </div>
              <div className="font-bold text-green-700 text-2xl">
                {metrics.functionCount || 0}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
              <div className="text-gray-600 text-xs font-semibold mb-1">
                Classes
              </div>
              <div className="font-bold text-orange-700 text-2xl">
                {metrics.classCount || 0}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Entities Section */}
        {Object.keys(entityGroups).length > 0 && (
          <CollapsibleSection
            title="Code Entities"
            icon={Box}
            count={entities.length}
            iconColor="text-purple-600"
            defaultOpen={true}
          >
            <div className="space-y-3">
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
          defaultOpen={imports.length > 0}
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
          defaultOpen={exports.length > 0}
        >
          {exports.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {exports.map((exp, idx) => (
                <EntityCard key={idx} entity={exp} />
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
          defaultOpen={outgoingNodes.length > 0}
        >
          {outgoingNodes.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {outgoingNodes.map(({ node, edge }) => (
                <DependencyCard
                  key={node.id}
                  node={node}
                  edge={edge}
                  type="outgoing"
                />
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
          defaultOpen={incomingNodes.length > 0}
        >
          {incomingNodes.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {incomingNodes.map(({ node, edge }) => (
                <DependencyCard
                  key={node.id}
                  node={node}
                  edge={edge}
                  type="incoming"
                />
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
