import { useIndexingEvents } from "@/hooks/use-indexingEvents";
import { IndexingProgress } from "@/types/gitWhiz";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  GitBranch,
  Info,
  Loader2,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Use your existing hook type
type IndexerProps = ReturnType<typeof useIndexingEvents>;

// Simple type aliases for clarity
type PhaseType = "cloning" | "processing" | "saving";

// Configuration object
const PHASE_CONFIGS = {
  cloning: {
    id: "cloning",
    title: "Source Code Ingestion & Discovery",
    description:
      "Cloning the Git repository, parsing the file tree, and filtering for relevant source files.",
    icon: GitBranch,
    colors: {
      active: "bg-white border-gray-300 text-gray-800",
      completed: "bg-white border-gray-300 text-gray-800",
      pending: "bg-slate-50 border-slate-200 text-slate-500",
    },
  },
  processing: {
    id: "processing",
    title: "Semantic Analysis & Embedding Generation",
    description:
      "Generating vector embeddings for each file and leveraging AI to produce structured insights from the code.",
    icon: Zap,
    colors: {
      active: "bg-white border-gray-300 text-gray-800",
      completed: "bg-white border-gray-300 text-gray-800",
      pending: "bg-slate-50 border-slate-200 text-slate-500",
    },
  },
  saving: {
    id: "saving",
    title: "Embedding Storage & Metadata Persistence",
    description:
      "Persisting the generated embeddings and metadata to the database for semantic search.",
    icon: Database,
    colors: {
      active: "bg-white border-gray-300 text-gray-800",
      completed: "bg-white border-gray-300 text-gray-800",
      pending: "bg-slate-50 border-slate-200 text-slate-500",
    },
  },
};

// Utility functions
const getPhaseFromStatus = (status: string) => {
  if (["cloning", "pending", "connected", "idle"].includes(status))
    return "cloning";
  if (status === "processing") return "processing";
  if (status === "saving") return "saving";
  return null;
};

// const formatDuration = (seconds: number) => {
//   if (seconds < 60) return `${seconds.toFixed(1)}s`;
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
// };

const formatTimestamp = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Sub-components
const PhaseIcon = ({
  phase,
  isActive,
  isCompleted,
  className = "",
}: {
  phase: PhaseType;
  isActive: boolean;
  isCompleted: boolean;
  className?: string;
}) => {
  const config = PHASE_CONFIGS[phase];
  const IconComponent = config.icon;
  const size = 24;

  if (isCompleted) {
    return (
      <CheckCircle2 size={size} className={`text-emerald-500 ${className}`} />
    );
  }

  if (isActive) {
    return (
      <Loader2
        size={size}
        className={`text-current animate-spin ${className}`}
      />
    );
  }

  return <IconComponent size={size} className={`text-gray-400 ${className}`} />;
};

const ProgressBar = ({
  progress,
  phase,
  isCompleted,
  hasError,
}: {
  progress: number;
  phase: PhaseType | null;
  isCompleted: boolean;
  hasError: boolean;
}) => {
  const getProgressColor = () => {
    if (hasError) return "bg-red-500";
    if (isCompleted) return "bg-emerald-500";
    if (!phase) return "bg-slate-400";

    // switch (phase) {
    //   case "cloning":
    //     return "bg-blue-500";
    //   case "processing":
    //     return "bg-amber-500";
    //   case "saving":
    //     return "bg-purple-500";
    //   default:
    //     return "bg-gray-400";
    // }
    return "bg-gray-400";
  };

  return (
    <div className="relative">
      <div
        className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${progress}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor()} relative overflow-hidden`}
          style={{ width: `${Math.max(progress, 1)}%` }}
        >
          {!isCompleted && !hasError && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          )}
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>{progress}% Complete</span>
        {isCompleted && (
          <span className="text-emerald-600 font-medium">✓ Finished</span>
        )}
      </div>
    </div>
  );
};

const PhaseTab = ({
  phase,
  isActive,
  isCompleted,
  logs,
  current,
  total,
  isExpanded,
  onExpand,
}: {
  phase: PhaseType;
  isActive: boolean;
  isCompleted: boolean;
  logs: IndexingProgress[];
  current: number;
  total: number;
  isExpanded: boolean;
  onExpand: () => void;
}) => {
  const config = PHASE_CONFIGS[phase];

  const phaseLogs = useMemo(
    () => logs.filter((log) => getPhaseFromStatus(log.status) === phase),
    [logs, phase]
  );

  const getPhaseState = () => {
    if (isCompleted) return "completed";
    if (isActive) return "active";
    return "pending";
  };

  const phaseState = getPhaseState();
  const colorClasses = config.colors[phaseState];

  const getProgressInfo = () => {
    if (phase === "processing" && current && total) {
      return `${current}/${total} files`;
    }
    if (isCompleted) return "Complete";
    if (isActive) return "In Progress";
    return "Pending";
  };

  return (
    <div
      className={`border-2 rounded-md transition-all duration-300 ${colorClasses} ${
        isActive ? "shadow-md" : "shadow-sm"
      }`}
    >
      <button
        onClick={onExpand}
        className="w-full p-2 flex items-center justify-between hover:bg-black hover:bg-opacity-5 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        aria-expanded={isExpanded}
        aria-controls={`phase-${phase}-content`}
      >
        <div className="flex items-center gap-4 font-display">
          <div className="flex items-center gap-3">
            <PhaseIcon
              phase={phase}
              isActive={isActive}
              isCompleted={isCompleted}
              className="shrink-0 ml-1"
            />
            <div className="text-left min-w-0 flex-1">
              <div className="font-semibold text-base leading-tight">
                {config.title}
              </div>
              <div className="text-sm opacity-80 mt-0.5">
                {config.description}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-3 mt-1 text-xs opacity-70 ">
            <span>
              {phaseLogs.length} event{phaseLogs.length !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>{getProgressInfo()}</span>
            {isExpanded ? (
              <ChevronDown size={20} className="text-gray-600" />
            ) : (
              <ChevronRight size={20} className="mb-0.5 text-gray-600" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div
          id={`phase-${phase}-content`}
          className="border-t border-current border-opacity-20"
        >
          <div className="p-2 ml-12 max-h-64 overflow-y-auto">
            {phaseLogs.length > 0 ? (
              <div className="space-y-2">
                {[...phaseLogs].reverse().map((log, index) => (
                  <div
                    key={`${index}`}
                    className="flex gap-3 items-center text-sm p-2 rounded-lg bg-black bg-opacity-5"
                  >
                    <span className="text-gray-600 text-xs font-mono shrink-0 min-w-[60px]">
                      {formatTimestamp()}
                    </span>
                    <span className="text-current text-xs opacity-90 leading-relaxed">
                      {log.message}
                    </span>
                    {log.currentFile && (
                      <span className="text-xs font-code">{`[  ${log.currentFile}  ]`}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm opacity-60 italic py-4">
                <Info size={16} />
                <span>No events recorded for this phase yet</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Can be used in future
// const StatsGrid = ({
//   stats,
// }: {
//   stats: {
//     embeddingsGenerated: number;
//     savedToDatabase: number;
//     failed: number;
//     processingTimeSeconds: number;
//   };
// }) => {
//   const statsConfig = [
//     {
//       label: "Files Processed",
//       value: stats.embeddingsGenerated,
//       icon: FileText,
//       color: "blue",
//       description: "Code files analyzed",
//     },
//     {
//       label: "Successfully Saved",
//       value: stats.savedToDatabase,
//       icon: CheckCircle2,
//       color: "green",
//       description: "Embeddings stored",
//     },
//     {
//       label: "Failed Operations",
//       value: stats.failed,
//       icon: XCircle,
//       color: "red",
//       description: "Processing errors",
//     },
//     {
//       label: "Processing Time",
//       value: formatDuration(stats.processingTimeSeconds),
//       icon: TrendingUp,
//       color: "purple",
//       description: "Total duration",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//       {statsConfig.map(({ label, value, icon: Icon, color, description }) => (
//         <div
//           key={label}
//           className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4 transition-transform hover:scale-105`}
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <Icon size={18} className={`text-${color}-600`} />
//             <span className={`text-sm font-medium text-${color}-800`}>
//               {label}
//             </span>
//           </div>
//           <div className={`text-2xl font-bold text-${color}-900 mb-1`}>
//             {typeof value === "string" ? value : value.toLocaleString()}
//           </div>
//           <div className={`text-xs text-${color}-600 opacity-80`}>
//             {description}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// Main component
export const Indexer: React.FC<IndexerProps> = ({
  status,
  progress,
  message,
  logs,
  error,
  current,
  total,
  currentFile,
}) => {
  const activePhase = getPhaseFromStatus(status);
  const isCompleted = status === "completed";
  const hasError = status === "error";

  const [expandedPhase, setExpandedPhase] = useState<PhaseType | null>(null);

  const phaseStates = useMemo(() => {
    const processingStarted = logs.some(
      (log) => getPhaseFromStatus(log.status) === "processing"
    );
    const savingStarted = logs.some(
      (log) => getPhaseFromStatus(log.status) === "saving"
    );

    return {
      cloning: {
        hasStarted: logs.length > 0,
        isCompleted: processingStarted || isCompleted,
      },
      processing: {
        hasStarted: processingStarted,
        isCompleted: savingStarted || isCompleted,
      },
      saving: {
        hasStarted: savingStarted,
        isCompleted: isCompleted,
      },
    };
  }, [logs, isCompleted]);

  useEffect(() => {
    if (activePhase && expandedPhase !== activePhase) {
      setExpandedPhase(activePhase);
    }
  }, [activePhase, expandedPhase]);

  return (
    <div className="border-2 border-gray-200 rounded-md shadow-xl bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-50 to-purple-50 p-6 pt-8 border-b border-gray-200">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-display">
              GitWhiz Indexing Engine
            </h2>
            <p className="text-sm text-gray-600">
              Real-time semantic analysis of your repository.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full">
            <Activity
              size={14}
              className={
                !isCompleted && !hasError
                  ? "animate-pulse text-blue-500"
                  : "text-gray-500"
              }
            />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="font-mono text-sm text-gray-800 bg-gray-900/5 p-3 rounded-md flex items-center shadow-inner">
            <span className="text-gray-500 mr-2">{">"}</span>
            <span className="">{message}</span>
            {!isCompleted && currentFile && (
              <span className=" ml-auto text-sm font-code text-gray-600">
                [{currentFile}]
              </span>
            )}
            {!isCompleted && !hasError && (
              <span className="ml-2 w-2 h-4 bg-gray-800 animate-pulse rounded-sm"></span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!["idle", "completed", "error"].includes(status) && (
          <div className="mt-4">
            <ProgressBar
              progress={progress}
              phase={activePhase}
              isCompleted={isCompleted}
              hasError={hasError}
            />
          </div>
        )}
      </div>

      {/* Phase Tabs */}
      <div className="p-6 space-y-4">
        {(["cloning", "processing", "saving"] as PhaseType[]).map((phase) => {
          const phaseState = phaseStates[phase];
          if (!phaseState.hasStarted) return null;

          return (
            <PhaseTab
              key={phase}
              phase={phase}
              isActive={activePhase === phase}
              isCompleted={phaseState.isCompleted}
              logs={logs}
              current={current ?? 0}
              total={total ?? 0}
              isExpanded={expandedPhase === phase}
              onExpand={() => setExpandedPhase(phase)}
            />
          );
        })}
      </div>

      {/* Error State */}
      {hasError && (
        <div className="px-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
            <div className="flex items-start  gap-6">
              <AlertTriangle
                size={24}
                className="text-red-500 shrink-0  ml-2"
              />
              <div>
                <p className="text-red-800 leading-relaxed">
                  {error ||
                    "An unexpected error occurred during the indexing process. Please try again or contact support if the issue persists."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
