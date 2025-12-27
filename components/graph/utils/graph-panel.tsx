import {
  PanelLeft,
  PanelRight,
  ArrowDown,
  ArrowRight,
  RefreshCw,
  Workflow,
} from "lucide-react";
import { ConnectionLineType, Node, Panel } from "reactflow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GraphPanelProps {
  direction: "TB" | "LR";
  connectionType: ConnectionLineType;
  onLayout: (direction: "TB" | "LR") => void;
  onConnectionTypeChange: (type: ConnectionLineType) => void;
  fetchGraph: () => void;
  primarySidebarOpen: boolean;
  setPrimarySidebarOpen: (open: boolean) => void;
  secondarySidebarOpen: boolean;
  setSecondarySidebarOpen: (open: boolean) => void;
  selectedNode: Node | null;
}

const connectionTypes = [
  { value: ConnectionLineType.Straight, label: "Straight", icon: "━" },
  { value: ConnectionLineType.Bezier, label: "Bezier", icon: "∿" },
  { value: ConnectionLineType.Step, label: "Step", icon: "⌐" },
  { value: ConnectionLineType.SmoothStep, label: "Smooth", icon: "⌙" },
  { value: ConnectionLineType.SimpleBezier, label: "Simple", icon: "⌢" },
];

export function GraphPanel({
  direction,
  connectionType,
  onConnectionTypeChange,
  onLayout,
  fetchGraph,
  primarySidebarOpen,
  setPrimarySidebarOpen,
  secondarySidebarOpen,
  setSecondarySidebarOpen,
  selectedNode,
}: GraphPanelProps) {
  return (
    <Panel position="top-right" className="m-4 z-10">
      <div className="flex items-center gap-1 p-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md shadow-sm">
        <Button
          variant={primarySidebarOpen ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setPrimarySidebarOpen(!primarySidebarOpen)}
          title="Toggle Explorer (Cmd+B)"
        >
          <PanelLeft size={16} />
        </Button>

        <Button
          variant={secondarySidebarOpen ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
          disabled={!selectedNode}
          title="Toggle Details"
        >
          <PanelRight size={16} className={!selectedNode ? "opacity-50" : ""} />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button
          variant={direction === "TB" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onLayout("TB")}
          title="Vertical Layout"
        >
          <ArrowDown size={16} />
        </Button>

        <Button
          variant={direction === "LR" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onLayout("LR")}
          title="Horizontal Layout"
        >
          <ArrowRight size={16} />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
              title="Connection Type"
            >
              <Workflow size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 pt-2 mt-2">
            <DropdownMenuLabel className="text-xs font-semibold">
              Connection Type
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {connectionTypes.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => onConnectionTypeChange(type.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm">{type.label}</span>
                <span className="text-lg font-mono ml-2 text-muted-foreground">
                  {type.icon}
                </span>
                {connectionType === type.value && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
          onClick={fetchGraph}
          title="Refresh Graph"
        >
          <RefreshCw size={15} />
        </Button>
      </div>
    </Panel>
  );
}
