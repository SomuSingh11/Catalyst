import { ParsedEntity } from "@/types/parser";
import { Package } from "lucide-react";

export const ImportCard = ({ imp }: { imp: ParsedEntity }) => {
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
        </div>
      </div>

      {importData.defaultImportName && (
        <div className="mt-2 space-y-1">
          <div className="text-xs font-semibold text-indigo-700">
            Default Import:
          </div>
          <div className="flex flex-wrap gap-1">
            {importData.isDefault && (
              <span className="text-xs bg-white text-indigo-900 px-2 py-1 rounded border border-indigo-200 font-mono">
                {importData.defaultImportName}
              </span>
            )}
          </div>
        </div>
      )}

      {importData.specifiers && importData.specifiers.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-xs font-semibold text-indigo-700">
            Named Imports:
          </div>
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
