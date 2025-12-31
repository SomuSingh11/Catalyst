import { FileMetrics } from "@/types/parser";

interface MetricCardProps {
  metrics: FileMetrics;
}

export const MetricCard = ({ metrics }: MetricCardProps) => {
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
    <div className="grid grid-cols-2 gap-4">
      {/* Lines of Code */}
      <div className="group relative overflow-hidden rounded-lg border border-blue-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Lines of Code
          </div>
          <div className="font-bold text-blue-600 text-3xl tabular-nums">
            {metrics.loc || 0}
          </div>
        </div>
      </div>

      {/* Complexity */}
      <div className="group relative overflow-hidden rounded-lg border border-purple-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Complexity
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`font-bold text-3xl tabular-nums ${complexityColor}`}
            >
              {metrics.complexity || 0}
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                (metrics.complexity || 0) <= 5
                  ? "bg-green-100 text-green-700"
                  : (metrics.complexity || 0) <= 10
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {complexityLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Functions */}
      <div className="group relative overflow-hidden rounded-lg border border-emerald-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Functions
          </div>
          <div className="font-bold text-emerald-600 text-3xl tabular-nums">
            {metrics.functionCount || 0}
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="group relative overflow-hidden rounded-lg border border-amber-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-amber-300">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Classes
          </div>
          <div className="font-bold text-amber-600 text-3xl tabular-nums">
            {metrics.classCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
};
