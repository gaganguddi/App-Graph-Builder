import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const statusStyles = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  error: "border-red-500/40 bg-red-500/10 text-red-400",
};

export function RightPanel() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const nodes = useAppStore((state) => state.nodes);
  const updateNodeData = useAppStore((state) => state.updateNodeData);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);
  const activeInspectorTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useAppStore((state) => state.setActiveInspectorTab);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const data = selectedNode?.data;

  const updateNumber = (field: "cpu" | "memory" | "disk", value: number) => {
    if (!selectedNode) {
      return;
    }

    updateNodeData(selectedNode.id, { [field]: value });
  };

  const panelContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Inspector</h2>
          <button
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/60 lg:hidden"
            onClick={() => setIsMobilePanelOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-white/45">Selected service configuration</p>
      </div>

      {!data || !selectedNode ? (
        <div className="grid flex-1 place-items-center p-6 text-center text-sm text-white/45">
          <div>
            <div className="mx-auto mb-4 size-12 rounded-md border border-white/10 bg-white/[0.03]" />
            Select a node on the canvas to inspect metrics, config, and logs.
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Input
                  className="h-auto border-transparent bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
                  onChange={(event) => updateNodeData(selectedNode.id, { name: event.target.value })}
                  value={data.name}
                />
                <p className="mt-1 text-sm text-white/45">{data.region} / {data.provider.toUpperCase()}</p>
              </div>

              <span className={cn("shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[data.status])}>
                {data.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/55">
              <Metric label="CPU" value={data.cpu.toFixed(2)} />
              <Metric label="Memory" value={`${data.memory.toFixed(2)} GB`} />
              <Metric label="Disk" value={`${data.disk.toFixed(2)} GB`} />
            </div>
          </div>

          <Tabs value={activeInspectorTab} onValueChange={setActiveInspectorTab}>
            <TabsList className="grid h-10 w-full grid-cols-3 border border-white/10 bg-black/20">
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
                <span className="mb-2 block text-sm text-white/60">Service Name</span>
                <Input
                  className="border-white/10 bg-black/20 text-white"
                  onChange={(event) => updateNodeData(selectedNode.id, { name: event.target.value })}
                  value={data.name}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/60">Region</span>
                <Input
                  className="border-white/10 bg-black/20 text-white"
                  onChange={(event) => updateNodeData(selectedNode.id, { region: event.target.value })}
                  value={data.region}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/60">Description</span>
                <Textarea
                  className="min-h-28 resize-none border-white/10 bg-black/20 text-white"
                  onChange={(event) => updateNodeData(selectedNode.id, { description: event.target.value })}
                  value={data.description}
                />
              </label>
            </TabsContent>

            <TabsContent value="logs" className="mt-5 space-y-2">
              {data.logs.map((line) => (
                <div className="rounded-md border border-white/10 bg-black/25 p-3 font-mono text-xs text-white/70" key={line}>
                  {line}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden w-[360px] shrink-0 border-l border-white/10 bg-[#05070d]/95 backdrop-blur-xl xl:block">
        {panelContent}
      </aside>

      <div className={cn("fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition xl:hidden", isMobilePanelOpen ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setIsMobilePanelOpen(false)} />

      <aside className={cn("fixed bottom-0 right-0 top-0 z-50 w-full max-w-[390px] border-l border-white/10 bg-[#05070d] transition-transform xl:hidden", isMobilePanelOpen ? "translate-x-0" : "translate-x-full")}>
        {panelContent}
      </aside>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="font-semibold text-white">{value}</p>
      <p className="mt-1">{label}</p>
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
  return (
    <label className="block rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/75">{label}</span>
        <Input
          className="h-9 w-24 border-white/10 bg-black/30 text-right text-white"
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          step={step}
          type="number"
          value={Number.isFinite(value) ? value : 0}
        />
      </div>

      <Slider
        className="[&_[data-slot=slider-range]]:bg-[linear-gradient(90deg,#2563eb,#06b6d4,#22c55e)] [&_[data-slot=slider-track]]:bg-white/10"
        max={max}
        min={min}
        onValueChange={([nextValue]) => onChange(nextValue ?? min)}
        step={step}
        value={[value]}
      />
    </label>
  );
}
