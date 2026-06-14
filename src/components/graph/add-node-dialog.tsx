import { useState } from "react";
import { Box, Code2, Database, Server, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { ServiceNodeData, ServiceStatus } from "@/types";

type NodeTypeOption = {
  label: string;
  icon: ServiceNodeData["icon"];
  glyph: typeof Database;
};

const nodeTypes: NodeTypeOption[] = [
  { label: "PostgreSQL", icon: "postgres", glyph: Database },
  { label: "Redis", icon: "redis", glyph: Box },
  { label: "MongoDB", icon: "mongo", glyph: Database },
  { label: "Auth API", icon: "api", glyph: Server },
  { label: "Java API", icon: "api", glyph: Code2 },
  { label: "Python Worker", icon: "worker", glyph: Workflow },
  { label: "Custom Service", icon: "api", glyph: Server },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddNodeDialog({ open, onOpenChange }: Props) {
  const addNode = useAppStore((state) => state.addNode);
  const theme = useAppStore((state) => state.theme);

  const [selectedType, setSelectedType] = useState<NodeTypeOption>(nodeTypes[0]);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<ServiceNodeData["provider"]>("aws");
  const [region, setRegion] = useState("us-east-1");
  const [status, setStatus] = useState<ServiceStatus>("success");

  const resetForm = () => {
    setSelectedType(nodeTypes[0]);
    setName("");
    setProvider("aws");
    setRegion("us-east-1");
    setStatus("success");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    addNode({
      icon: selectedType.icon,
      name: name.trim(),
      provider,
      region: region.trim() || "us-east-1",
      status,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Service Node</DialogTitle>
          <DialogDescription>
            Provision a new infrastructure node and place it on the active graph canvas.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Node Type</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {nodeTypes.map((type) => {
                const Icon = type.glyph;
                const isSelected = selectedType.label === type.label;

                return (
                  <button
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition",
                      theme === "light"
                        ? "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                        : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/20 hover:bg-white/[0.06]",
                      isSelected &&
                        (theme === "light"
                          ? "border-indigo-400 bg-indigo-50 text-indigo-900 shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                          : "border-cyan-300/40 bg-indigo-500/15 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"),
                    )}
                    key={type.label}
                    onClick={() => setSelectedType(type)}
                    type="button"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                className={cn(
                  theme === "light"
                    ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    : "border-white/10 bg-black/25 text-white placeholder:text-white/40",
                )}
                id="service-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Auth API"
                required
                value={name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <select
                className={cn(
                  "h-9 w-full rounded-md border px-3 text-sm outline-none transition",
                  theme === "light"
                    ? "border-slate-200 bg-slate-50 text-slate-900"
                    : "border-white/10 bg-black/25 text-white",
                )}
                id="provider"
                onChange={(event) =>
                  setProvider(event.target.value as ServiceNodeData["provider"])
                }
                value={provider}
              >
                <option value="aws">AWS</option>
                <option value="gcp">GCP</option>
                <option value="azure">Azure</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                className={cn(
                  theme === "light"
                    ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    : "border-white/10 bg-black/25 text-white placeholder:text-white/40",
                )}
                id="region"
                onChange={(event) => setRegion(event.target.value)}
                placeholder="us-east-1"
                value={region}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="status">Status</Label>
              <select
                className={cn(
                  "h-9 w-full rounded-md border px-3 text-sm outline-none transition",
                  theme === "light"
                    ? "border-slate-200 bg-slate-50 text-slate-900"
                    : "border-white/10 bg-black/25 text-white",
                )}
                id="status"
                onChange={(event) => setStatus(event.target.value as ServiceStatus)}
                value={status}
              >
                <option value="success">Healthy</option>
                <option value="warning">Degraded</option>
                <option value="error">Failed</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              className={cn(
                theme === "light"
                  ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.1]",
              )}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-500 text-white hover:bg-indigo-600"
              disabled={!name.trim()}
              type="submit"
            >
              Add to Graph
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
