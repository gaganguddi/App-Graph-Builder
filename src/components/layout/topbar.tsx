import { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronDown, Moon, Share2, Sun } from "lucide-react";

import type { AppSummary } from "@/types";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

type Props = {
  apps: AppSummary[];
};

export function Topbar({ apps }: Props) {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedApp = apps.find((app) => app.id === selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const theme = useAppStore((state) => state.theme);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const appMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAppMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!appMenuRef.current?.contains(event.target as Node)) {
        setIsAppMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isAppMenuOpen]);

  return (
    <header className={cn(
      "z-30 flex h-[76px] shrink-0 items-center justify-between border-b backdrop-blur-xl transition-colors duration-300",
      theme === "light"
        ? "border-slate-200/80 bg-slate-50/90 text-slate-900"
        : "border-white/10 bg-[#05070d]/95"
    )}>
      <div className="flex min-w-0 items-center gap-4 px-4 md:px-6">
        <div className={cn(
          "grid h-10 w-10 place-items-center rounded-md border shadow-[0_0_30px_rgba(59,130,246,0.18)]",
          theme === "light"
            ? "border-slate-300 bg-slate-900 text-white"
            : "border-white/20 bg-white text-black"
        )}>
          <div className={cn(
            "h-6 w-6 rounded-br-xl border-4 border-l-transparent border-t-transparent",
            theme === "light" ? "border-slate-900 border-t-white border-l-white" : "border-black"
          )} />
        </div>

        <div className="hidden min-w-0 items-center gap-3 sm:flex">
          <h1 className="text-lg font-semibold tracking-normal">
            App Graph Builder
          </h1>

          <span className="rounded-md bg-indigo-500 px-2 py-1 text-xs font-semibold text-white">
            Pro
          </span>
        </div>

        <div className="relative ml-1 hidden md:block" ref={appMenuRef}>
          <button
            aria-expanded={isAppMenuOpen}
            className={cn(
              "flex h-11 min-w-0 items-center gap-3 rounded-md border px-4 text-sm font-medium shadow-inner transition hover:opacity-80 lg:min-w-[300px]",
              theme === "light"
                ? "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]",
            )}
            onClick={() => setIsAppMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <Share2 className={cn("size-4", theme === "light" ? "text-slate-600" : "text-white/60")} />
            <span className="truncate">{selectedApp?.name ?? "Select app"}</span>
            <ChevronDown
              className={cn(
                "ml-auto size-4 transition-transform duration-200",
                isAppMenuOpen && "rotate-180",
                theme === "light" ? "text-slate-600" : "text-white/60",
              )}
            />
          </button>

          {isAppMenuOpen && (
            <div
              className={cn(
                "absolute left-0 top-[calc(100%+10px)] z-50 w-full min-w-[300px] overflow-hidden rounded-lg border p-1.5 shadow-2xl backdrop-blur-xl",
                theme === "light"
                  ? "border-slate-200/90 bg-white/95 shadow-slate-300/30"
                  : "border-white/10 bg-[#05070d]/95 shadow-black/45",
              )}
            >
              {apps.map((app) => {
                const isSelected = app.id === selectedAppId;

                return (
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition",
                      theme === "light"
                        ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                        : "text-white/75 hover:bg-white/[0.06] hover:text-white",
                      isSelected &&
                        (theme === "light"
                          ? "bg-indigo-50 text-indigo-950"
                          : "bg-cyan-400/[0.08] text-white"),
                    )}
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setIsAppMenuOpen(false);
                    }}
                    type="button"
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-md border",
                        theme === "light"
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-white/10 bg-white/[0.04] text-white/60",
                      )}
                    >
                      <Share2 size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{app.name}</span>
                      <span
                        className={cn(
                          "block truncate text-xs",
                          theme === "light" ? "text-slate-500" : "text-white/42",
                        )}
                      >
                        {app.runtime} / {app.region}
                      </span>
                    </span>
                    {isSelected && (
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          theme === "light" ? "text-indigo-500" : "text-cyan-300",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-4 md:gap-3 md:px-6">
        <button className={cn(
          "hidden h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition sm:flex",
          theme === "light"
            ? "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        )}>
          <Share2 size={17} />
          Share
        </button>

        <button
          className={cn(
            "grid size-11 place-items-center rounded-md border transition",
            theme === "light"
              ? "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
              : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
          )}
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          type="button"
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className={cn(
          "grid size-11 place-items-center rounded-md border transition",
          theme === "light"
            ? "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        )}>
          <Bell size={18} />
        </button>

        <div className={cn(
          "relative grid size-11 place-items-center rounded-full border p-[3px] shadow-[0_0_26px_rgba(99,102,241,0.5)]",
          theme === "light"
            ? "border-purple-400/50 bg-[linear-gradient(135deg,rgba(139,92,246,0.6),rgba(59,130,246,0.6))]"
            : "border-cyan-300/40 bg-[linear-gradient(135deg,rgba(168,85,247,0.8),rgba(14,165,233,0.8))]"
        )}>
          <img
            alt="Profile avatar"
            className="size-full rounded-full border border-white/20 object-cover"
            src="/anime-avatar.svg"
          />
          <span className={cn(
            "absolute bottom-1 right-1 size-3 rounded-full border-2",
            theme === "light" ? "border-slate-50 bg-emerald-400" : "border-[#05070d] bg-emerald-400"
          )} />
        </div>
      </div>
    </header>
  );
}
