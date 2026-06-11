import { Cpu, Ellipsis, Globe2, HardDrive, MemoryStick, Server } from "lucide-react";
import { Handle, Position } from "reactflow";

import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { ServiceNodeData } from "@/types";

type Props = {
  id: string;

  data: ServiceNodeData;
};

const statusStyles = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  error: "border-red-500/40 bg-red-500/10 text-red-400",
};

export function ServiceNode({ id, data }: Props) {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  const isSelected = selectedNodeId === id;

  return (
    <>
      <Handle className="!size-2.5 !border-cyan-100 !bg-cyan-300 !shadow-[0_0_12px_rgba(34,211,238,0.9)]" type="target" position={Position.Left} />

      <div
        className={cn(
          "relative w-[438px] cursor-pointer overflow-hidden rounded-xl border bg-white/[0.055] p-4 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl transition duration-300",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025)_42%,rgba(14,165,233,0.07))]",
          "after:pointer-events-none after:absolute after:inset-x-8 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-cyan-200/50 after:to-transparent",
          isSelected
            ? "border-cyan-300/70 shadow-[0_0_42px_rgba(34,211,238,0.28)]"
            : "border-white/15 hover:-translate-y-0.5 hover:border-cyan-200/35 hover:shadow-[0_0_34px_rgba(14,165,233,0.16)]",
        )}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedNodeId(id);
        }}
      >
        <div className="relative z-10 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ServiceLogo icon={data.icon} />

            <h3 className="text-lg font-semibold">{data.name}</h3>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[data.status])}>
              {data.status}
            </span>
            <button className="grid size-8 place-items-center rounded-md bg-white/[0.05] text-white/70" type="button">
              <Ellipsis size={16} />
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-4 text-center text-sm text-white">
          <span>{data.cpu.toFixed(2)}</span>
          <span>{data.memory.toFixed(2)} GB</span>
          <span>{data.disk.toFixed(2)} GB</span>
          <span>1</span>
        </div>

        <div className="relative z-10 mt-2 grid grid-cols-4 rounded-lg border border-white/10 bg-black/20 text-sm text-white/85 shadow-inner shadow-white/[0.03]">
          {[
            { label: "CPU", icon: Cpu },
            { label: "Memory", icon: MemoryStick },
            { label: "Disk", icon: HardDrive },
            { label: "Region", icon: Globe2 },
          ].map((metric, index) => (
            <div
              className={cn(
                "flex items-center justify-center gap-2 px-3 py-2",
                index === 0 && "rounded-md bg-white text-[#0b1120] shadow-lg shadow-white/10",
              )}
              key={metric.label}
            >
              <metric.icon size={16} />
              {metric.label}
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_34%,#22c55e_57%,#ef4444_100%)]">
            <div className="ml-auto h-full w-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
          </div>
          <div className="grid h-10 w-24 place-items-center rounded-md border border-white/10 bg-black/20 text-sm">
            {data.cpu.toFixed(2)}
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80">
            <Globe2 size={16} />
            {data.region}
          </div>

          <div className="text-right leading-none">
            <p className="text-2xl font-black lowercase tracking-normal text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              aws
            </p>
            <div className="ml-auto mt-1 h-1 w-10 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
          </div>
        </div>

        {data.status === "error" && (
          <div className="relative z-10 mt-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.12)]">
            <p className="font-semibold text-red-400">Connection failed</p>
            <p className="mt-1 text-xs text-red-100/70">Unable to connect to {data.name} instance</p>
          </div>
        )}
      </div>

      <Handle className="!size-2.5 !border-cyan-100 !bg-cyan-300 !shadow-[0_0_12px_rgba(34,211,238,0.9)]" type="source" position={Position.Right} />
    </>
  );
}

function ServiceLogo({ icon }: { icon: ServiceNodeData["icon"] }) {
  const baseClass = "grid size-11 shrink-0 place-items-center rounded-lg border shadow-lg";

  if (icon === "postgres") {
    return (
      <div className={cn(baseClass, "border-sky-300/30 bg-sky-500/15 shadow-sky-500/15")}>
        <svg className="size-7" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3C9.4 3 5 6.1 5 10.7v6.6C5 21.9 9.4 25 16 25s11-3.1 11-7.7v-6.6C27 6.1 22.6 3 16 3Z" fill="#336791" />
          <path d="M10 13c1.6 1.2 3.6 1.8 6 1.8s4.4-.6 6-1.8M10 18c1.6 1.2 3.6 1.8 6 1.8s4.4-.6 6-1.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
          <path d="M12 8.5h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (icon === "redis") {
    return (
      <div className={cn(baseClass, "border-red-300/30 bg-red-500/15 shadow-red-500/15")}>
        <svg className="size-7" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 20.5 16 26l11-5.5L16 15 5 20.5Z" fill="#a41e11" />
          <path d="M5 15.5 16 21l11-5.5L16 10 5 15.5Z" fill="#d82c20" />
          <path d="M5 10.5 16 16l11-5.5L16 5 5 10.5Z" fill="#ff4438" />
          <path d="m12 9 4-1 4 1-4 2-4-2Z" fill="#fff" opacity=".9" />
          <path d="m10 12.5 6 3 6-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".65" />
        </svg>
      </div>
    );
  }

  if (icon === "mongo") {
    return (
      <div className={cn(baseClass, "border-emerald-300/30 bg-emerald-500/15 shadow-emerald-500/15")}>
        <svg className="size-7" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3c5 5.3 7.2 10.2 6.4 14.8C21.7 22 19.6 25.1 16 27c-3.6-1.9-5.7-5-6.4-9.2C8.8 13.2 11 8.3 16 3Z" fill="#47a248" />
          <path d="M16 6v21" stroke="#d9f99d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn(baseClass, "border-indigo-300/30 bg-indigo-500/15 text-cyan-100 shadow-indigo-500/20")}>
      <Server className="size-6" />
    </div>
  );
}
