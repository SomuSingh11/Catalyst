import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, LucideIcon } from "lucide-react";
import React, { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  iconColor?: string;
}

export const CollapsibleSection = ({
  title,
  icon,
  count,
  children,
  defaultOpen = true,
  iconColor = "text-gray-600",
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = icon;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-gray-200"
    >
      <CollapsibleTrigger asChild>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
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
          <ChevronRight
            size={16}
            className="text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90"
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down mt-2">
        <div className="pb-4 px-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
