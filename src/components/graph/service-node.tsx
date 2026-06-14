import {
  Container,
  Cpu,
  Ellipsis,
  GitBranch,
  Globe2,
  HardDrive,
  MemoryStick,
  Server,
  ShipWheel,
} from "lucide-react";
import { Handle, Position } from "reactflow";

import { useAppStore } from "@/store/app-store";
import { getStatusStyle } from "@/lib/theme-styles";
import { cn } from "@/lib/utils";
import type { ServiceNodeData } from "@/types";

type Props = {
  id: string;
  data: ServiceNodeData;
};

export function ServiceNode({ id, data }: Props) {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const theme = useAppStore((state) => state.theme);

  const isSelected = selectedNodeId === id;
  const isLight = theme === "light";

  return (
    <>
      <Handle
        className={cn(
          "!size-2.5 !shadow-[0_0_12px_rgba(34,211,238,0.9)]",
          isLight ? "!border-sky-400 !bg-sky-500" : "!border-cyan-100 !bg-cyan-300",
        )}
        type="target"
        position={Position.Left}
      />

      <div
        className={cn(
          "relative w-[438px] cursor-pointer overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-2xl transition duration-300",
          isLight
            ? "border-slate-200/90 bg-white/80 text-slate-900 shadow-slate-300/50 before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(241,245,249,0.6)_45%,rgba(56,189,248,0.06))] after:pointer-events-none after:absolute after:inset-x-8 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-sky-300/60 after:to-transparent"
            : "border-white/15 bg-white/[0.055] text-white shadow-black/50 before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025)_42%,rgba(14,165,233,0.07))] after:pointer-events-none after:absolute after:inset-x-8 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-cyan-200/50 after:to-transparent",
          isSelected
            ? isLight
              ? "border-sky-400/80 shadow-[0_0_32px_rgba(56,189,248,0.22)]"
              : "border-cyan-300/70 shadow-[0_0_42px_rgba(34,211,238,0.28)]"
            : isLight
              ? "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(100,116,139,0.18)]"
              : "hover:-translate-y-0.5 hover:border-cyan-200/35 hover:shadow-[0_0_34px_rgba(14,165,233,0.16)] hover:bg-white/[0.065]",
        )}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedNodeId(id);
        }}
      >
        <div className="relative z-10 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ServiceLogo icon={data.icon} theme={theme} />
            <h3 className="text-lg font-semibold">{data.name}</h3>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-semibold capitalize",
                getStatusStyle(theme, data.status),
              )}
            >
              {data.status}
            </span>
            <button
              className={cn(
                "grid size-8 place-items-center rounded-md transition",
                isLight
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-white/[0.05] text-white/70",
              )}
              type="button"
            >
              <Ellipsis size={16} />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "relative z-10 grid grid-cols-4 gap-4 text-center text-sm",
            isLight ? "text-slate-800" : "text-white",
          )}
        >
          <span>{data.cpu.toFixed(2)}</span>
          <span>{data.memory.toFixed(2)} GB</span>
          <span>{data.disk.toFixed(2)} GB</span>
          <span>1</span>
        </div>

        <div
          className={cn(
            "relative z-10 mt-2 grid grid-cols-4 rounded-lg border text-sm shadow-inner",
            isLight
              ? "border-slate-200 bg-slate-50 text-slate-700 shadow-slate-200/40"
              : "border-white/10 bg-black/20 text-white/85 shadow-white/[0.03]",
          )}
        >
          {[
            { label: "CPU", icon: Cpu },
            { label: "Memory", icon: MemoryStick },
            { label: "Disk", icon: HardDrive },
            { label: "Region", icon: Globe2 },
          ].map((metric, index) => (
            <div
              className={cn(
                "flex items-center justify-center gap-2 px-3 py-2",
                index === 0 &&
                  (isLight
                    ? "rounded-md bg-slate-900 text-white shadow-md shadow-slate-400/30"
                    : "rounded-md bg-white text-[#0b1120] shadow-lg shadow-white/10"),
              )}
              key={metric.label}
            >
              <metric.icon size={16} />
              {metric.label}
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-2">
          <div
            className={cn(
              "h-2 flex-1 overflow-hidden rounded-full",
              isLight ? "bg-slate-200" : "bg-white/10",
            )}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-400 to-orange-400"
              style={{ width: `${Math.min(data.cpu * 100, 100)}%` }}
            />
          </div>
          <div
            className={cn(
              "w-14 rounded-md border py-1 text-center text-xs font-medium",
              isLight
                ? "border-slate-200 bg-white text-slate-700"
                : "border-white/10 bg-black/30 text-white/90",
            )}
          >
            {Math.min(Math.round(data.cpu * 100), 100)}%
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between">
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-700"
                : "border-white/10 bg-white/[0.03] text-white/80",
            )}
          >
            <Globe2 size={16} />
            {data.region}
          </div>

          <div className="text-right leading-none">
            <p
              className={cn(
                "text-2xl font-black lowercase tracking-normal drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]",
                isLight ? "text-slate-800" : "text-white",
              )}
            >
              {data.provider}
            </p>
            <div className="ml-auto mt-1 h-1 w-10 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
          </div>
        </div>

        {data.status === "error" && (
          <div
            className={cn(
              "relative z-10 mt-4 rounded-lg border p-3 text-sm",
              isLight
                ? "border-red-300 bg-red-50 text-red-800 shadow-[0_0_18px_rgba(239,68,68,0.08)]"
                : "border-red-500/40 bg-red-950/40 text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.12)]",
            )}
          >
            <p className={cn("font-semibold", isLight ? "text-red-700" : "text-red-400")}>
              Connection failed
            </p>
            <p className={cn("mt-1 text-xs", isLight ? "text-red-600/80" : "text-red-100/70")}>
              Unable to connect to {data.name} instance
            </p>
          </div>
        )}
      </div>

      <Handle
        className={cn(
          "!size-2.5 !shadow-[0_0_12px_rgba(34,211,238,0.9)]",
          isLight ? "!border-sky-400 !bg-sky-500" : "!border-cyan-100 !bg-cyan-300",
        )}
        type="source"
        position={Position.Right}
      />
    </>
  );
}

function ServiceLogo({
  icon,
  theme,
}: {
  icon: ServiceNodeData["icon"];
  theme: "dark" | "light";
}) {
  const baseClass = cn(
    "flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-lg",
    theme === "light" && "shadow-slate-200/60",
  );

  if (icon === "postgres") {
    return (
      <div className={cn(baseClass, "border-sky-300/40 bg-sky-500/15 shadow-sky-500/15")}>
        <svg className="size-5" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M16 3C9.4 3 5 6.1 5 10.7v6.6C5 21.9 9.4 25 16 25s11-3.1 11-7.7v-6.6C27 6.1 22.6 3 16 3Z"
            fill="#336791"
          />
          <path
            d="M10 13c1.6 1.2 3.6 1.8 6 1.8s4.4-.6 6-1.8M10 18c1.6 1.2 3.6 1.8 6 1.8s4.4-.6 6-1.8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".9"
          />
          <path d="M12 8.5h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (icon === "redis") {
    return (
      <div className={cn(baseClass, "border-red-300/40 bg-red-500/15 shadow-red-500/15")}>
        <svg className="size-5" viewBox="0 0 32 32" aria-hidden="true">
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
      <div className={cn(baseClass, "border-emerald-300/40 bg-emerald-500/15 shadow-emerald-500/15")}>
        <svg className="size-5" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M16 3c5 5.3 7.2 10.2 6.4 14.8C21.7 22 19.6 25.1 16 27c-3.6-1.9-5.7-5-6.4-9.2C8.8 13.2 11 8.3 16 3Z"
            fill="#47a248"
          />
          <path d="M16 6v21" stroke="#d9f99d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (icon === "worker") {
    return (
      <div className={cn(baseClass, "border-violet-300/40 bg-violet-500/15 text-violet-600 shadow-violet-500/15")}>
        <Server className="size-5" />
      </div>
    );
  }

  if (icon === "github") {
    return (
      <div className={cn(baseClass, "border-slate-300/40 bg-slate-900 text-white shadow-slate-900/20")}>
        <GitBranch className="size-5" />
      </div>
    );
  }

  if (icon === "docker") {
    return (
      <div className={cn(baseClass, "border-cyan-300/40 bg-cyan-500/15 text-cyan-500 shadow-cyan-500/15")}>
        <Container className="size-5" />
      </div>
    );
  }

  if (icon === "kubernetes") {
    return (
      <div className={cn(baseClass, "border-amber-300/50 bg-amber-400/15 text-amber-500 shadow-amber-400/20")}>
        <ShipWheel className="size-5" />
      </div>
    );
  }

  return (
    <div className={cn(baseClass, "border-indigo-300/40 bg-indigo-500/15 text-indigo-600 shadow-indigo-500/20")}>
      <Server className="size-5" />
    </div>
  );
}
