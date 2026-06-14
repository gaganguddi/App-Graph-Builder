import {
  Box,
  Container,
  Database,
  GitBranch,
  Hexagon,
  ShipWheel,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { StackNodeKind } from "@/store/app-store";

export const STACK_DRAG_MIME = "application/app-graph-stack";

type StackOption = {
  kind: StackNodeKind;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  glowClass: string;
};

const stackOptions: StackOption[] = [
  {
    kind: "github",
    label: "GitHub",
    icon: GitBranch,
    colorClass: "bg-slate-950 text-white border-slate-500/40",
    glowClass: "shadow-slate-950/35",
  },
  {
    kind: "postgres",
    label: "PostgreSQL",
    icon: Database,
    colorClass: "bg-sky-500/18 text-sky-300 border-sky-300/35",
    glowClass: "shadow-sky-500/25",
  },
  {
    kind: "redis",
    label: "Redis",
    icon: Box,
    colorClass: "bg-red-500/18 text-red-300 border-red-300/35",
    glowClass: "shadow-red-500/25",
  },
  {
    kind: "mongo",
    label: "MongoDB",
    icon: Hexagon,
    colorClass: "bg-emerald-500/18 text-emerald-300 border-emerald-300/35",
    glowClass: "shadow-emerald-500/25",
  },
  {
    kind: "docker",
    label: "Docker",
    icon: Container,
    colorClass: "bg-cyan-500/18 text-cyan-300 border-cyan-300/35",
    glowClass: "shadow-cyan-500/25",
  },
  {
    kind: "kubernetes",
    label: "Kubernetes",
    icon: ShipWheel,
    colorClass: "bg-amber-400/18 text-amber-300 border-amber-300/40",
    glowClass: "shadow-amber-400/25",
  },
];

export function StackToolbar() {
  return (
    <div className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-xl border border-white/10 bg-[#05070d]/72 p-2 shadow-[0_18px_46px_rgba(2,6,23,0.45),0_0_32px_rgba(56,189,248,0.12)] backdrop-blur-xl">
      <div className="flex flex-col gap-2">
        {stackOptions.map((stack) => {
          const Icon = stack.icon;

          return (
            <button
              aria-label={`Drag ${stack.label} onto graph`}
              className={cn(
                "nodrag nopan grid size-11 cursor-grab place-items-center rounded-xl border shadow-lg transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:cursor-grabbing",
                stack.colorClass,
                stack.glowClass,
              )}
              draggable
              key={stack.kind}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "copy";
                event.dataTransfer.setData(STACK_DRAG_MIME, stack.kind);
                event.dataTransfer.setData("text/plain", stack.kind);
              }}
              title={stack.label}
              type="button"
            >
              <Icon className="size-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
