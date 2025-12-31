import { ParsedEntity } from "@/types/parser";
import { useState } from "react";
import { getEntityColor, getEntityIcon } from "../utils/get-entity";
import { ChevronDown, ChevronRight, Zap } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const EntityCard = ({ entity }: { entity: ParsedEntity }) => {
  const [expandedChildren, setExpandedChildren] = useState(false);
  const [expandedSignature, setExpandedSignature] = useState(false);
  const [expandedParams, setExpandedParams] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState(false);

  const hasChildren = entity.children && entity.children.length > 0;
  const isFunction = entity.type.toLowerCase().includes("function");
  const hasComplexity = entity.complexity !== undefined;
  const hasSignature = entity.signature && entity.signature.trim().length > 0;
  const hasParameters = entity.parameters && entity.parameters.length > 0;
  const hasLocation = entity.location;

  const getComplexityState = (val: number) => {
    if (val <= 5)
      return { label: "Low", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (val <= 10)
      return { label: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "High", color: "text-red-600", bg: "bg-red-100" };
  };

  const complexityState = hasComplexity
    ? getComplexityState(entity.complexity!)
    : null;

  return (
    <div
      className={`border rounded-lg overflow-hidden ${getEntityColor(
        entity.type
      )}`}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-1">{getEntityIcon(entity.type, 16)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                {entity.name}
                {entity.modifiers && entity.modifiers.length > 0 && (
                  <span className="text-xs opacity-60">
                    [{entity.modifiers.join(", ")}]
                  </span>
                )}

                {isFunction && hasComplexity && complexityState && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${complexityState.bg} ${complexityState.color}`}
                  >
                    <Zap size={10} />
                    {entity.complexity} - {complexityState.label}
                  </span>
                )}
              </div>

              {hasSignature && (
                <Collapsible
                  open={expandedSignature}
                  onOpenChange={setExpandedSignature}
                  className="mt-2"
                >
                  <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    {expandedSignature ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                    Signature
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="text-xs font-mono opacity-75 break-all bg-white bg-opacity-50 p-2 rounded">
                      {entity.signature}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {hasParameters && (
                <Collapsible
                  open={expandedParams}
                  onOpenChange={setExpandedParams}
                  className="mt-2"
                >
                  <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    {expandedParams ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                    Parameters ({entity.parameters!.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="text-xs opacity-70 bg-white bg-opacity-50 p-2 rounded">
                      {entity.parameters!.map((p, i) => (
                        <div key={i} className="mb-1 last:mb-0">
                          <span className="font-mono">
                            {p.name}
                            {p.type ? (
                              <span className="text-gray-500">: {p.type}</span>
                            ) : null}
                            {p.optional ? "?" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {hasLocation && (
                <Collapsible
                  open={expandedLocation}
                  onOpenChange={setExpandedLocation}
                  className="mt-2"
                >
                  <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    {expandedLocation ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                    Location
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="text-xs opacity-60 font-mono bg-white bg-opacity-50 p-2 rounded">
                      Line {entity.location?.start.line}:
                      {entity.location?.start.column} →{" "}
                      {entity.location?.end.line}:{entity.location?.end.column}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nested Children - Collapsible */}
      {hasChildren && (
        <Collapsible
          open={expandedChildren}
          onOpenChange={setExpandedChildren}
          className="border-t"
        >
          <CollapsibleTrigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-white hover:bg-opacity-30 transition-colors">
            <span className="text-xs font-medium text-gray-700">
              Children ({entity.children!.length})
            </span>
            {expandedChildren ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white bg-opacity-50 p-2 space-y-2">
              {entity.children!.map((child, idx) => (
                <EntityCard key={idx} entity={child} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
