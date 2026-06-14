import { Trash2, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/app-store";
import { getStatusStyle } from "@/lib/theme-styles";
import { cn } from "@/lib/utils";

export function RightPanel() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const nodes = useAppStore((state) => state.nodes);
  const updateNodeData = useAppStore((state) => state.updateNodeData);
  const deleteSelectedNode = useAppStore((state) => state.deleteSelectedNode);
  const activeInspectorTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useAppStore((state) => state.setActiveInspectorTab);
  const theme = useAppStore((state) => state.theme);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const data = selectedNode?.data;
  const isOpen = Boolean(selectedNodeId && selectedNode && data);

  const updateNumber = (field: "cpu" | "memory" | "disk", value: number) => {
    if (!selectedNode) {
      return;
    }

    updateNodeData(selectedNode.id, { [field]: value });
  };

  const closeInspector = () => setSelectedNodeId(null);
  const handleDeleteNode = () => {
    deleteSelectedNode();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          theme === "light" ? "bg-slate-900/20" : "bg-black/55",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeInspector}
      />

      <aside
        className={cn(
          "fixed bottom-0 right-0 top-[76px] z-50 shrink-0 overflow-hidden border-l backdrop-blur-xl transition-all duration-300 ease-in-out xl:static xl:top-auto xl:z-auto",
          theme === "light"
            ? "border-slate-200/80 bg-slate-50/90"
            : "border-white/10 bg-[#05070d]/95",
          isOpen
            ? "w-full max-w-[390px] translate-x-0 opacity-100 xl:w-[360px]"
            : "pointer-events-none w-0 max-w-0 translate-x-full border-transparent opacity-0 xl:translate-x-0",
        )}
      >
        {isOpen && selectedNode && data && (
          <div className="flex h-full w-[360px] max-w-full flex-col">
            <div
              className={cn(
                "border-b p-5 transition-colors duration-300",
                theme === "light"
                  ? "border-slate-200/80 bg-white/60"
                  : "border-white/10 bg-black/20",
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <h2
                  className={cn(
                    "text-lg font-semibold",
                    theme === "light" ? "text-slate-900" : "text-white",
                  )}
                >
                  Inspector
                </h2>
                <button
                  className={cn(
                    "grid size-8 place-items-center rounded-md border transition",
                    theme === "light"
                      ? "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "border-white/10 text-white/60 hover:bg-white/[0.05]",
                  )}
                  onClick={closeInspector}
                  title="Close inspector"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
              <p
                className={cn(
                  "text-sm transition-colors duration-300",
                  theme === "light" ? "text-slate-600" : "text-white/45",
                )}
              >
                Service node details & metrics
              </p>
            </div>

            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                theme === "light" ? "bg-slate-50/50" : "",
              )}
            >
              <div
                className={cn(
                  "mb-5 rounded-lg border p-4 transition-colors duration-300",
                  theme === "light"
                    ? "border-slate-200/80 bg-white/80 shadow-sm shadow-slate-200/50"
                    : "border-white/10 bg-white/[0.035]",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Input
                      className={cn(
                        "h-auto border-transparent bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0",
                        theme === "light"
                          ? "text-slate-900 placeholder:text-slate-500"
                          : "text-white placeholder:text-white/40",
                      )}
                      onChange={(event) =>
                        updateNodeData(selectedNode.id, { name: event.target.value })
                      }
                      value={data.name}
                    />
                    <p
                      className={cn(
                        "mt-1 text-sm transition-colors duration-300",
                        theme === "light" ? "text-slate-600" : "text-white/45",
                      )}
                    >
                      {data.region} / {data.provider.toUpperCase()}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold capitalize transition-colors duration-300",
                      getStatusStyle(theme, data.status),
                    )}
                  >
                    {data.status}
                  </span>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-3 gap-2 text-center text-xs transition-colors duration-300",
                    theme === "light" ? "text-slate-600" : "text-white/55",
                  )}
                >
                  <Metric label="CPU" value={data.cpu.toFixed(2)} />
                  <Metric label="Memory" value={`${data.memory.toFixed(2)} GB`} />
                  <Metric label="Disk" value={`${data.disk.toFixed(2)} GB`} />
                </div>
              </div>

              <Tabs value={activeInspectorTab} onValueChange={setActiveInspectorTab}>
                <TabsList
                  className={cn(
                    "grid h-10 w-full grid-cols-3 border transition-colors duration-300",
                    theme === "light"
                      ? "border-slate-200 bg-slate-100/80"
                      : "border-white/10 bg-black/20",
                  )}
                >
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="mt-5 space-y-5">
                  <SyncedControl
                    label="CPU Allocation"
                    max={1}
                    min={0}
                    step={0.01}
                    value={data.cpu}
                    onChange={(value) => updateNumber("cpu", value)}
                  />
                  <SyncedControl
                    label="Memory"
                    max={4}
                    min={0}
                    step={0.01}
                    value={data.memory}
                    onChange={(value) => updateNumber("memory", value)}
                  />
                  <SyncedControl
                    label="Disk"
                    max={64}
                    min={1}
                    step={0.5}
                    value={data.disk}
                    onChange={(value) => updateNumber("disk", value)}
                  />
                </TabsContent>

                <TabsContent value="config" className="mt-5 space-y-4">
                  <label className="block">
                    <span
                      className={cn(
                        "mb-2 block text-sm transition-colors duration-300",
                        theme === "light" ? "text-slate-600" : "text-white/60",
                      )}
                    >
                      Service Name
                    </span>
                    <Input
                      className={cn(
                        "transition-colors duration-300",
                        theme === "light"
                          ? "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                          : "border-white/10 bg-black/20 text-white placeholder:text-white/40",
                      )}
                      onChange={(event) =>
                        updateNodeData(selectedNode.id, { name: event.target.value })
                      }
                      value={data.name}
                    />
                  </label>

                  <label className="block">
                    <span
                      className={cn(
                        "mb-2 block text-sm transition-colors duration-300",
                        theme === "light" ? "text-slate-600" : "text-white/60",
                      )}
                    >
                      Region
                    </span>
                    <Input
                      className={cn(
                        "transition-colors duration-300",
                        theme === "light"
                          ? "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                          : "border-white/10 bg-black/20 text-white placeholder:text-white/40",
                      )}
                      onChange={(event) =>
                        updateNodeData(selectedNode.id, { region: event.target.value })
                      }
                      value={data.region}
                    />
                  </label>

                  <label className="block">
                    <span
                      className={cn(
                        "mb-2 block text-sm transition-colors duration-300",
                        theme === "light" ? "text-slate-600" : "text-white/60",
                      )}
                    >
                      Description
                    </span>
                    <Textarea
                      className={cn(
                        "min-h-28 resize-none transition-colors duration-300",
                        theme === "light"
                          ? "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                          : "border-white/10 bg-black/20 text-white placeholder:text-white/40",
                      )}
                      onChange={(event) =>
                        updateNodeData(selectedNode.id, { description: event.target.value })
                      }
                      value={data.description}
                    />
                  </label>
                </TabsContent>

                <TabsContent value="logs" className="mt-5 space-y-2">
                  {data.logs.map((line) => (
                    <div
                      className={cn(
                        "rounded-md border p-3 font-mono text-xs transition-colors duration-300",
                        theme === "light"
                          ? "border-slate-200 bg-white text-slate-700"
                          : "border-white/10 bg-black/25 text-white/70",
                      )}
                      key={line}
                    >
                      {line}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <div
                className={cn(
                  "mt-6 border-t pt-4 transition-colors duration-300",
                  theme === "light" ? "border-slate-200/80" : "border-white/10",
                )}
              >
                <AlertDialog>
                  <div className="flex justify-end">
                    <AlertDialogTrigger asChild>
                      <Button
                        className={cn(
                          "h-9 rounded-lg px-3 text-sm shadow-none transition hover:shadow-[0_0_18px_rgba(239,68,68,0.18)]",
                          theme === "light"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-red-500/12 text-red-200 hover:bg-red-500/18",
                        )}
                        type="button"
                        variant="destructive"
                      >
                        <Trash2 size={15} />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Node</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently remove this service node from the infrastructure graph?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={handleDeleteNode}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const theme = useAppStore((state) => state.theme);

  return (
    <div
      className={cn(
        "rounded-md border p-3 transition-colors duration-300",
        theme === "light"
          ? "border-slate-200 bg-slate-50 text-slate-900"
          : "border-white/10 bg-black/20 text-white",
      )}
    >
      <p className="font-semibold">{value}</p>
      <p
        className={cn(
          "mt-1 transition-colors duration-300",
          theme === "light" ? "text-slate-600" : "",
        )}
      >
        {label}
      </p>
    </div>
  );
}

type SyncedControlProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

function SyncedControl({ label, min, max, step, value, onChange }: SyncedControlProps) {
  const theme = useAppStore((state) => state.theme);

  return (
    <label
      className={cn(
        "block rounded-lg border p-4 transition-colors duration-300",
        theme === "light"
          ? "border-slate-200/80 bg-white/80 shadow-sm shadow-slate-200/40"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            theme === "light" ? "text-slate-700" : "text-white/75",
          )}
        >
          {label}
        </span>
        <Input
          className={cn(
            "h-9 w-24 text-right transition-colors duration-300",
            theme === "light"
              ? "border-slate-200 bg-slate-50 text-slate-900"
              : "border-white/10 bg-black/30 text-white",
          )}
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          step={step}
          type="number"
          value={Number.isFinite(value) ? value : 0}
        />
      </div>

      <Slider
        className={cn(
          "[&_[data-slot=slider-range]]:bg-[linear-gradient(90deg,#2563eb,#06b6d4,#22c55e)]",
          theme === "light"
            ? "[&_[data-slot=slider-track]]:bg-slate-200"
            : "[&_[data-slot=slider-track]]:bg-white/10",
        )}
        max={max}
        min={min}
        onValueChange={([nextValue]) => onChange(nextValue ?? min)}
        step={step}
        value={[value]}
      />
    </label>
  );
}
