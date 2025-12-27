"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  FileCode2,
  Box,
  Braces,
  GitFork,
  ArrowRightFromLine,
  ArrowLeftToLine,
  Activity,
  Database,
  Terminal,
  Cpu,
  Fingerprint,
  Layers,
} from "lucide-react";

// --- Types ---

interface NodeMetrics {
  loc?: number;
  functionCount?: number;
  classCount?: number;
  complexity?: number;
  jsxElementCount?: number;
}

interface EnhancedNodeData {
  label: string;
  details: {
    fullPath: string;
    language: string;
    metrics?: NodeMetrics;
    imports: any[];
    exports: any[];
    entities: any[];
  };
}

// --- Utils & Config ---

const getLanguageConfig = (language: string) => {
  const normalizeLang = language?.toLowerCase() || "text";

  const configs: Record<string, { color: string; icon: any; bg: string }> = {
    typescript: { color: "text-blue-600", bg: "bg-blue-50", icon: FileCode2 },
    tsx: { color: "text-blue-600", bg: "bg-blue-50", icon: FileCode2 },
    javascript: {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: FileCode2,
    },
    jsx: { color: "text-yellow-600", bg: "bg-yellow-50", icon: FileCode2 },
    python: { color: "text-green-600", bg: "bg-green-50", icon: Terminal },
    css: { color: "text-sky-500", bg: "bg-sky-50", icon: Layers },
    json: { color: "text-orange-600", bg: "bg-orange-50", icon: Braces },
    default: { color: "text-gray-500", bg: "bg-gray-50", icon: FileCode2 },
  };

  return configs[normalizeLang] || configs.default;
};

const getCategoryIcon = (path: string) => {
  if (path.includes("/api/") || path.includes("route.")) return Fingerprint;
  if (path.includes("/components/")) return Box;
  if (path.includes("/lib/") || path.includes("/utils/")) return Cpu;
  if (path.includes("db.") || path.includes("prisma")) return Database;
  return FileCode2;
};

// --- Sub-Components ---

const MetricBadge = ({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: any;
  label: string;
  value: number;
  highlight?: boolean;
}) => (
  <div
    className={`flex items-center gap-2 px-2 py-1.5 rounded-md border ${
      highlight
        ? "bg-indigo-50 border-indigo-100 text-indigo-700"
        : "bg-gray-50 border-gray-100 text-gray-600"
    }`}
  >
    <Icon className="w-3.5 h-3.5 opacity-70" />
    <div className="flex flex-col leading-none">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-semibold">
        {label}
      </span>
      <span className="text-xs font-bold font-mono">{value}</span>
    </div>
  </div>
);

const ComplexityBar = ({ value }: { value: number }) => {
  // Normalize complexity to a percentage (capped at 20 for visual purposes)
  const percentage = Math.min((value / 20) * 100, 100);

  let colorClass = "bg-green-500";
  if (value > 5) colorClass = "bg-yellow-500";
  if (value > 10) colorClass = "bg-orange-500";
  if (value > 15) colorClass = "bg-red-500";

  return (
    <div className="mt-3">
      <div className="flex justify-between items-end mb-1">
        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
          <Activity className="w-3 h-3" />
          <span>Complexity</span>
        </div>
        <span
          className={`text-xs font-bold ${colorClass.replace("bg-", "text-")}`}
        >
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

function EnhancedFileNodeComponent({
  data,
  selected,
}: NodeProps<EnhancedNodeData>) {
  const { details, label } = data;
  const metrics = details.metrics || {};

  const langConfig = getLanguageConfig(details.language);
  const CategoryIcon = getCategoryIcon(details.fullPath);
  const LangIcon = langConfig.icon;

  const functionCount = metrics.functionCount || 0;
  const classCount = metrics.classCount || 0;
  const loc = metrics.loc || 0;

  return (
    <div
      className={`
        relative group min-w-[300px] max-w-[340px] rounded-xl bg-white 
        transition-all duration-200 ease-in-out
        ${
          selected
            ? "shadow-[0_0_0_2px_#3b82f6,0_10px_25px_-5px_rgba(59,130,246,0.15)] scale-[1.02]"
            : "shadow-md border border-gray-200 hover:shadow-xl hover:border-gray-300"
        }
      `}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white transition-colors group-hover:!bg-blue-500"
      />

      {/* Header */}
      <div
        className={`flex items-start justify-between p-4 border-b border-gray-100 ${langConfig.bg}/30`}
      >
        <div className="flex items-start gap-3 overflow-hidden">
          <div className={`p-2 rounded-lg ${langConfig.bg}`}>
            <CategoryIcon className={`w-5 h-5 ${langConfig.color}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3
              className="font-bold text-gray-800 text-sm truncate leading-tight"
              title={label}
            >
              {label}
            </h3>
            <span
              className="text-[10px] text-gray-500 font-mono truncate mt-0.5"
              title={details.fullPath}
            >
              {details.fullPath}
            </span>
          </div>
        </div>
        <div
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${langConfig.bg} ${langConfig.color}`}
        >
          {details.language || "FILE"}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <MetricBadge
            icon={Braces}
            label="Functions"
            value={functionCount}
            highlight={functionCount > 5}
          />
          <MetricBadge icon={Box} label="Classes" value={classCount} />
          <MetricBadge
            icon={ArrowRightFromLine}
            label="Imports"
            value={details.imports.length}
          />
          <MetricBadge
            icon={ArrowLeftToLine}
            label="Exports"
            value={details.exports.length}
          />
        </div>

        {/* Secondary Metrics & Complexity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span className="flex items-center gap-1.5">
              <GitFork className="w-3 h-3" />
              <span>
                LOC:{" "}
                <span className="font-mono font-medium text-gray-700">
                  {loc}
                </span>
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              <span>
                Entities:{" "}
                <span className="font-mono font-medium text-gray-700">
                  {details.entities.length}
                </span>
              </span>
            </span>
          </div>

          {(metrics.complexity || 0) > 0 && (
            <ComplexityBar value={metrics.complexity || 0} />
          )}
        </div>
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white transition-colors group-hover:!bg-blue-500"
      />
    </div>
  );
}

export const EnhancedFileNode = memo(EnhancedFileNodeComponent);
