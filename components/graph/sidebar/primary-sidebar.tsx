"use client";

import { Node } from "reactflow";
import { buildFileTreeFromNodes, FileTreeView } from "../utils/buildFileTree";
import FileTreeSkeleton from "../../utilities/filetree-skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Activity, FileText, Layers, Share2 } from "lucide-react";

interface PrimarySidebarProps {
  nodes: Node[];
  stats: {
    totalFiles: number;
    totalDependencies: number;
    totalFunctions: number;
    totalClasses: number;
    avgComplexity: number;
  };
  onFileSelect: (node: Node) => void;
  selectedNode: Node | null;
  isOpen: boolean;
}

const chartConfig = {
  count: {
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PrimarySidebar({
  nodes,
  stats,
  onFileSelect,
  selectedNode,
  isOpen,
}: PrimarySidebarProps) {
  const fileTree = buildFileTreeFromNodes(nodes);
  const chartData = [
    { metric: "Files", count: stats.totalFiles },
    { metric: "Deps.", count: stats.totalDependencies },
    { metric: "Functions", count: stats.totalFunctions },
    { metric: "AvgComplexity", count: stats.avgComplexity },
    { metric: "Classes", count: stats.totalClasses },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden rounded-r-xl">
      <div className="p-2 border-b border-gray-200 bg-white">
        {/* Header Section */}
        <div className=" bg-white">
          <Card className="border-0 shadow-none rounded-none bg-transparent">
            <CardHeader className="items-center pb-2 pt-4">
              <CardTitle className="text-lg font-bold text-gray-800">
                Project Overview
              </CardTitle>
              <CardDescription className="text-xs">
                Codebase Metrics & Complexity
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto w-full h-[200px] max-h-[200px]"
              >
                <RadarChart data={chartData}>
                  <ChartTooltip
                    cursor={false}
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;

                      const item = payload[0].payload;

                      return (
                        <div className="rounded-md bg-white px-3 py-2 shadow flex gap-2 border text-xs">
                          <div className="font-semibold text-gray-800">
                            {item.metric}
                          </div>
                          <div className="text-gray-600">{item.count}</div>
                        </div>
                      );
                    }}
                  />
                  <PolarGrid className="stroke-gray-200" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                  />
                  <Radar
                    dataKey="count"
                    fill="var(--color-count)"
                    fillOpacity={0.5}
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fillOpacity: 1,
                      fill: "var(--color-count)",
                    }}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-xs pt-4 pb-4">
              <div className="text-muted-foreground flex items-center justify-between w-full px-4 text-[10px]">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {stats.totalFiles} Files
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" /> {stats.totalDependencies} Deps
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" /> {stats.totalFunctions}{" "}
                  Functions
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* File Tree */}
      <div className="px-4 py-3 bg-gray-100/50 border-b border-gray-200 flex items-center gap-2">
        <Layers className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          File Explorer
        </span>
      </div>

      {/* File Tree Scrollable Area */}
      <div className="flex-1 overflow-auto min-h-0 bg-gray-50/50 p-2">
        {Object.keys(fileTree).length === 0 ? (
          <FileTreeSkeleton />
        ) : (
          <FileTreeView
            tree={fileTree}
            onFileSelect={onFileSelect}
            selectedNode={selectedNode}
          />
        )}
      </div>
    </div>
  );
}
