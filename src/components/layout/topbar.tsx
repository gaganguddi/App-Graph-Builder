import { Bell, ChevronDown, Moon, Share2 } from "lucide-react";

import type { AppSummary } from "@/types";
import { useAppStore } from "@/store/app-store";

type Props = {
  apps: AppSummary[];
};

export function Topbar({ apps }: Props) {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedApp = apps.find((app) => app.id === selectedAppId);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <header className="z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 bg-[#05070d]/95 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white text-black shadow-[0_0_30px_rgba(59,130,246,0.18)]">
          <div className="h-6 w-6 rounded-br-xl border-4 border-black border-l-transparent border-t-black" />
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <h1 className="text-lg font-semibold tracking-normal">
            App Graph Builder
          </h1>

          <span className="rounded-md bg-indigo-500 px-2 py-1 text-xs font-semibold text-white">
            Pro
          </span>
        </div>

        <button className="ml-2 hidden h-11 min-w-0 items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white shadow-inner shadow-white/[0.03] transition hover:bg-white/[0.06] md:flex lg:min-w-[280px]">
          <Share2 className="size-4 text-white/60" />
          <span className="truncate">{selectedApp?.name ?? "Select app"}</span>
          <ChevronDown className="ml-auto size-4 text-white/60" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden h-11 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold transition hover:bg-white/[0.06] sm:flex">
          <Share2 size={17} />
          Share
        </button>

        <button
          className="grid size-11 place-items-center rounded-md border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.06]"
          onClick={toggleTheme}
          type="button"
        >
          <Moon size={18} />
        </button>

        <button className="grid size-11 place-items-center rounded-md border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.06]">
          <Bell size={18} />
        </button>

        <div className="relative grid size-11 place-items-center rounded-full border border-cyan-300/40 bg-[linear-gradient(135deg,rgba(168,85,247,0.8),rgba(14,165,233,0.8))] p-[3px] shadow-[0_0_26px_rgba(99,102,241,0.5)]">
          <img
            alt="Profile avatar"
            className="size-full rounded-full border border-white/20 object-cover"
            src="/anime-avatar.svg"
          />
          <span className="absolute bottom-1 right-1 size-3 rounded-full border-2 border-[#05070d] bg-emerald-400" />
        </div>
      </div>
    </header>
  );
}
