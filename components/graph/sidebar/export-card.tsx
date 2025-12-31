import { ArrowUpRight } from "lucide-react";
import { ParsedEntity } from "@/types/parser";

interface ExportCardProps {
  entity: ParsedEntity;
}

export const ExportCard = ({ entity }: ExportCardProps) => {
  const signature = entity.signature?.trim();
  const hasSignature = signature && signature.length > 1;

  return (
    <div className="bg-emerald-50 p-3 rounded-lg text-sm border border-emerald-200">
      <div className="flex items-start gap-2 mb-2">
        <ArrowUpRight size={14} className="text-emerald-600 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-emerald-900 break-all flex items-center gap-2">
            {entity.name}
          </div>
        </div>
      </div>

      {/* Signature */}
      {hasSignature && (
        <div className="mt-2 space-y-1">
          <div className="text-xs font-semibold text-emerald-700">
            Signature:
          </div>
          <div className="text-xs bg-white text-emerald-900 px-2 py-1.5 rounded border border-emerald-200 font-mono break-all">
            {signature.length > 100
              ? `${signature.substring(0, 100)}...`
              : signature}
          </div>
        </div>
      )}
    </div>
  );
};
