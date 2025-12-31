import {
  Box,
  Braces,
  Code2,
  FileType,
  FunctionSquare,
  Layers,
  LucideIcon,
  Pi,
  Variable,
  Zap,
} from "lucide-react";

export const getEntityIcon = (type: string, size = 14) => {
  const iconMap: Record<string, LucideIcon> = {
    function: FunctionSquare,
    async_function: Zap,
    class: Box,
    interface: FileType,
    type: Braces,
    variable: Variable,
    constant: Pi,
    enum: Layers,
  };
  const Icon = iconMap[type] || Code2;
  return <Icon size={size} />;
};

export const getEntityColor = (type: string) => {
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
