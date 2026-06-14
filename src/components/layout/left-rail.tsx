import { useState, type ReactNode } from "react";
import {
  Box,
  Database,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Network,
  Plus,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Workflow,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { AddNodeDialog } from "@/components/graph/add-node-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AppSummary } from "@/types";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

type Props = {
  apps: AppSummary[];
  isLoading: boolean;
  error: Error | null;
};

const services = [
  { name: "Postgres", icon: Database, color: "from-sky-500 to-cyan-400" },
  { name: "Redis", icon: Box, color: "from-red-500 to-orange-400" },
  { name: "MongoDB", icon: Sparkles, color: "from-green-500 to-lime-400" },
];

const navItems = [
  { id: "applications", label: "Applications", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: Workflow },
  { id: "databases", label: "Databases", icon: Database },
  { id: "monitoring", label: "Monitoring", icon: LineChart },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const sectionCopy: Record<string, { eyebrow: string; title: string; blurb: string }> = {
  applications: {
    eyebrow: "Workspace",
    title: "Applications",
    blurb: "Switch between your deployed services and app views.",
  },
  services: {
    eyebrow: "Orchestration",
    title: "Services",
    blurb: "Inspect service flows, dependencies, and delivery lanes.",
  },
  databases: {
    eyebrow: "Data layer",
    title: "Databases",
    blurb: "Manage core data stores and database connections.",
  },
  monitoring: {
    eyebrow: "Observability",
    title: "Monitoring",
    blurb: "Track performance, health, and incident signals.",
  },
  settings: {
    eyebrow: "Control center",
    title: "Settings",
    blurb: "Configure workspace preferences, roles, and integrations.",
  },
};

function RailIconButton({
  label,
  isActive,
  showTooltip,
  onClick,
  children,
  className,
}: {
  label: string;
  isActive?: boolean;
  showTooltip: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const theme = useAppStore((state) => state.theme);

  const button = (
    <button
      className={cn(
        "group relative grid size-11 place-items-center rounded-md border border-transparent transition duration-200 hover:-translate-y-0.5",
        className ?? "mb-4",
        theme === "light"
          ? "text-slate-600 hover:border-slate-300 hover:bg-white/80 hover:text-slate-900 hover:shadow-[0_0_16px_rgba(100,116,139,0.12)]"
          : "text-white/70 hover:border-white/10 hover:bg-white/[0.07] hover:text-white hover:shadow-[0_0_22px_rgba(56,189,248,0.18)]",
        isActive &&
          "border-cyan-300/30 bg-indigo-500 text-white shadow-[0_0_26px_rgba(99,102,241,0.45)]",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
      {isActive && (
        <span
          className={cn(
            "absolute -right-[17px] h-7 w-1 rounded-l-full shadow-[0_0_16px_rgba(34,211,238,0.75)]",
            theme === "light" ? "bg-cyan-400" : "bg-cyan-300",
          )}
        />
      )}
    </button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function LeftRail({ apps, isLoading, error }: Props) {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const activeSidebarSection = useAppStore((state) => state.activeSidebarSection);
  const setActiveSidebarSection = useAppStore((state) => state.setActiveSidebarSection);
  const selectSidebarSection = useAppStore((state) => state.selectSidebarSection);
  const theme = useAppStore((state) => state.theme);
  const isSidebarExpanded = useAppStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const isMobileSidebarOpen = useAppStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useAppStore((state) => state.closeMobileSidebar);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);

  const showTooltips = !isSidebarExpanded;
  const activeNavItem = navItems.find((item) => item.id === activeSidebarSection);

  const selectMobileSection = (section: typeof navItems[number]["id"]) => {
    setActiveSidebarSection(section);
    closeMobileSidebar();
  };

  const selectMobileApp = (appId: string) => {
    setActiveSidebarSection("applications");
    setSelectedAppId(appId);
    closeMobileSidebar();
  };

  return (
    <>
    <div
      aria-hidden={!isMobileSidebarOpen}
      className={cn(
        "fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
        isMobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={closeMobileSidebar}
    />

    <aside
      aria-hidden={!isMobileSidebarOpen}
      aria-label="Mobile sidebar navigation"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(88vw,320px)] flex-col overflow-hidden border-r shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out xl:hidden",
        theme === "light"
          ? "border-slate-200/80 bg-slate-50/95 text-slate-900 shadow-slate-900/15"
          : "border-white/10 bg-[#05070d]/95 text-white shadow-black/50",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className={cn(
        "flex shrink-0 items-center justify-between border-b p-4",
        theme === "light" ? "border-slate-200/80 bg-white/60" : "border-white/10 bg-black/20",
      )}>
        <div className="min-w-0">
          <p className={cn("text-xs font-semibold uppercase tracking-normal", theme === "light" ? "text-slate-500" : "text-white/45")}>
            Navigation
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold">{activeNavItem?.label}</h2>
        </div>

        <button
          aria-label="Close sidebar navigation"
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-md border transition",
            theme === "light"
              ? "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]",
          )}
          onClick={closeMobileSidebar}
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid grid-cols-2 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarSection === item.id;

            return (
              <button
                className={cn(
                  "flex min-h-12 items-center gap-2 rounded-md border px-3 text-left text-sm font-semibold transition",
                  theme === "light"
                    ? "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                    : "border-white/10 bg-white/[0.035] text-white/75 hover:bg-white/[0.07] hover:text-white",
                  isActive &&
                    (theme === "light"
                      ? "border-indigo-300 bg-indigo-50 text-indigo-950"
                      : "border-cyan-300/25 bg-indigo-500/20 text-white"),
                )}
                key={item.id}
                onClick={() => selectMobileSection(item.id)}
                type="button"
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={cn("mt-4 rounded-md border p-4", theme === "light" ? "border-slate-200 bg-slate-100/90 text-slate-700" : "border-white/10 bg-white/[0.045] text-white/80")}>
          <p className={cn("text-[11px] uppercase tracking-[0.2em]", theme === "light" ? "text-slate-500" : "text-white/45")}>{sectionCopy[activeSidebarSection]?.eyebrow}</p>
          <h3 className={cn("mt-1 text-sm font-semibold", theme === "light" ? "text-slate-900" : "text-white")}>{sectionCopy[activeSidebarSection]?.title}</h3>
          <p className={cn("mt-2 text-xs leading-5", theme === "light" ? "text-slate-600" : "text-white/55")}>{sectionCopy[activeSidebarSection]?.blurb}</p>
        </div>

        {activeSidebarSection === "applications" && (
          <div className="mt-4 space-y-4">
            <label className={cn(
              "flex h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors duration-300",
              theme === "light"
                ? "border-slate-300 bg-white text-slate-500 placeholder:text-slate-400"
                : "border-white/10 bg-black/20 text-white/40 placeholder:text-white/40"
            )}>
              <Search size={16} />
              <input
                className={cn(
                  "min-w-0 flex-1 bg-transparent outline-none",
                  theme === "light"
                    ? "text-slate-700 placeholder:text-slate-500"
                    : "text-white placeholder:text-white/40"
                )}
                placeholder="Search applications..."
              />
            </label>

            <div className="space-y-2.5">
              {isLoading && (
                <p className={cn(
                  "rounded-md border p-3 text-sm transition-colors duration-300",
                  theme === "light"
                    ? "border-slate-300 bg-slate-200 text-slate-600"
                    : "border-white/10 bg-white/[0.03] text-white/50"
                )}>
                  Loading applications...
                </p>
              )}

              {error && (
                <p className={cn(
                  "rounded-md border p-3 text-sm transition-colors duration-300",
                  theme === "light"
                    ? "border-red-300 bg-red-100 text-red-700"
                    : "border-red-400/30 bg-red-950/30 text-red-100"
                )}>
                  Unable to load apps.
                </p>
              )}

              {apps.map((app) => (
                <button
                  className={cn(
                    "flex w-full items-center gap-3.5 rounded-md border border-transparent px-3 py-2.5 text-left text-sm font-semibold transition duration-200",
                    theme === "light"
                      ? "text-slate-700 hover:border-slate-300/90 hover:bg-slate-200/90 hover:text-slate-900 hover:shadow-sm"
                      : "text-white/85 hover:border-white/10 hover:bg-white/[0.055] hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
                    selectedAppId === app.id &&
                      (theme === "light"
                        ? "border-blue-300 bg-blue-100 text-blue-900 shadow-[inset_0_0_18px_rgba(59,130,246,0.1)]"
                        : "border-cyan-300/20 bg-cyan-400/[0.06] text-white shadow-[inset_0_0_18px_rgba(34,211,238,0.06)]"),
                  )}
                  key={app.id}
                  onClick={() => selectMobileApp(app.id)}
                  type="button"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-[0_8px_18px_rgba(79,70,229,0.22)]">
                    <Rocket size={17} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{app.name}</span>
                </button>
              ))}
            </div>

            <div>
              <p className={cn(
                "mb-3 text-xs font-semibold uppercase tracking-normal transition-colors duration-300",
                theme === "light" ? "text-slate-500" : "text-white/40"
              )}>
                Data Stores
              </p>

              <div className="space-y-2.5">
                {services.map((service) => (
                  <button
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-md border border-transparent px-3 py-2 text-left text-sm font-semibold transition",
                      theme === "light"
                        ? "text-slate-700 hover:border-slate-300/90 hover:bg-slate-200/90 hover:text-slate-900 hover:shadow-sm"
                        : "text-white/85 hover:border-white/10 hover:bg-white/[0.055] hover:text-white"
                    )}
                    key={service.name}
                    onClick={() => selectMobileSection("databases")}
                    type="button"
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-md bg-gradient-to-br shadow-[0_8px_18px_rgba(15,23,42,0.18)]", service.color)}>
                      <service.icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{service.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSidebarSection !== "applications" && (
          <div className={cn("mt-4 rounded-md border p-4 text-sm", theme === "light" ? "border-slate-200 bg-slate-100/90 text-slate-700" : "border-white/10 bg-white/[0.04] text-white/75")}>
            {activeSidebarSection === "services" && "Service orchestration views and pipeline health will appear here."}
            {activeSidebarSection === "databases" && "Database connections, replicas, and storage health will appear here."}
            {activeSidebarSection === "monitoring" && "Monitoring charts, alerts, and incidents will appear here."}
            {activeSidebarSection === "settings" && "Workspace preferences and account controls will appear here."}
          </div>
        )}
      </div>

      <div className={cn(
        "shrink-0 border-t p-4",
        theme === "light" ? "border-slate-200/80 bg-white/60" : "border-white/10 bg-black/20",
      )}>
        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-indigo-500 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.3)] transition hover:bg-indigo-600"
          onClick={() => {
            setIsAddNodeOpen(true);
            closeMobileSidebar();
          }}
          type="button"
        >
          <Plus size={17} />
          Add service node
        </button>
      </div>
    </aside>

    <aside className={cn(
      "hidden min-h-0 shrink-0 border-r backdrop-blur-xl transition-all duration-300 xl:flex",
      theme === "light"
        ? "border-slate-200/80 bg-slate-50/90"
        : "border-white/10 bg-[#05070d]/95"
    )}>
      <div className={cn(
        "hidden md:flex flex-col items-center border-r py-5 transition-all duration-300",
        theme === "light"
          ? "border-slate-200/80 bg-slate-100/70"
          : "border-white/10 bg-[#05070d]/50"
      )}>
        {navItems.slice(0, 4).map((item) => {
          const isActive = activeSidebarSection === item.id;
          const Icon = item.icon;

          return (
            <RailIconButton
              isActive={isActive}
              key={item.id}
              label={item.label}
              onClick={() => selectSidebarSection(item.id)}
              showTooltip={showTooltips}
            >
              <Icon size={20} />
            </RailIconButton>
          );
        })}

        <div className="mt-auto space-y-3">
          <RailIconButton
            isActive={activeSidebarSection === "settings"}
            label="Settings"
            onClick={() => selectSidebarSection("settings")}
            showTooltip={showTooltips}
          >
            <Settings size={20} />
          </RailIconButton>

          <RailIconButton label="Help" onClick={() => undefined} showTooltip={showTooltips}>
            <HelpCircle size={20} />
          </RailIconButton>

          <RailIconButton
            label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={toggleSidebar}
            showTooltip={showTooltips}
          >
            {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </RailIconButton>
        </div>
      </div>

      <div className={cn(
        "hidden xl:flex min-h-0 flex-col overflow-hidden transition-all duration-300 ease-in-out",
        isSidebarExpanded
          ? "w-[280px] opacity-100 pointer-events-auto"
          : "w-0 opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "border-b p-6 transition-colors duration-300 shrink-0",
          theme === "light"
            ? "border-slate-200/80 bg-white/60"
            : "border-white/10 bg-black/20"
        )}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className={cn(
              "text-xl font-semibold",
              theme === "light" ? "text-slate-900" : "text-white"
            )}>
              {navItems.find((item) => item.id === activeSidebarSection)?.label}
            </h2>
            <button
              className="grid size-9 place-items-center rounded-md bg-indigo-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.3)] transition hover:bg-indigo-600"
              onClick={() => setIsAddNodeOpen(true)}
              title="Add service node"
              type="button"
            >
              <Plus size={19} />
            </button>
          </div>

          {activeSidebarSection === "applications" && (
            <label className={cn(
              "flex h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors duration-300",
              theme === "light"
                ? "border-slate-300 bg-slate-200 text-slate-500 placeholder:text-slate-400"
                : "border-white/10 bg-black/20 text-white/40 placeholder:text-white/40"
            )}>
              <Search size={16} />
              <input
                className={cn(
                  "min-w-0 flex-1 bg-transparent outline-none",
                  theme === "light"
                    ? "text-slate-700 placeholder:text-slate-500"
                    : "text-white placeholder:text-white/40"
                )}
                placeholder="Search applications..."
              />
            </label>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className={cn("mb-6 rounded-md border p-4 transition-all duration-300", theme === "light" ? "border-slate-200/90 bg-slate-100/90 text-slate-700" : "border-white/10 bg-white/[0.045] text-white/80")}> 
            <p className={cn("text-[11px] uppercase tracking-[0.2em]", theme === "light" ? "text-slate-500" : "text-white/45")}>{sectionCopy[activeSidebarSection]?.eyebrow}</p>
            <h3 className={cn("mt-1 text-sm font-semibold", theme === "light" ? "text-slate-900" : "text-white")}>{sectionCopy[activeSidebarSection]?.title}</h3>
            <p className={cn("mt-2 text-xs leading-5", theme === "light" ? "text-slate-600" : "text-white/55")}>{sectionCopy[activeSidebarSection]?.blurb}</p>
          </div>

          {activeSidebarSection === "applications" && (
            <>
              <div className="space-y-2.5">
                {isLoading && (
                  <p className={cn(
                    "rounded-md border p-3 text-sm transition-colors duration-300",
                    theme === "light"
                      ? "border-slate-300 bg-slate-200 text-slate-600"
                      : "border-white/10 bg-white/[0.03] text-white/50"
                  )}>
                    Loading applications...
                  </p>
                )}

                {error && (
                  <p className={cn(
                    "rounded-md border p-3 text-sm transition-colors duration-300",
                    theme === "light"
                      ? "border-red-300 bg-red-100 text-red-700"
                      : "border-red-400/30 bg-red-950/30 text-red-100"
                  )}>
                    Unable to load apps.
                  </p>
                )}

                {apps.map((app) => (
                  <button
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-md border border-transparent px-3 py-2.5 text-left text-sm font-semibold transition duration-200",
                      theme === "light"
                        ? "text-slate-700 hover:border-slate-300/90 hover:bg-slate-200/90 hover:text-slate-900 hover:shadow-sm"
                        : "text-white/85 hover:border-white/10 hover:bg-white/[0.055] hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
                      selectedAppId === app.id &&
                        (theme === "light"
                          ? "border-blue-300 bg-blue-100 text-blue-900 shadow-[inset_0_0_18px_rgba(59,130,246,0.1)]"
                          : "border-cyan-300/20 bg-cyan-400/[0.06] text-white shadow-[inset_0_0_18px_rgba(34,211,238,0.06)]"),
                    )}
                    key={app.id}
                    onClick={() => {
                      selectSidebarSection("applications");
                      setSelectedAppId(app.id);
                    }}
                    type="button"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-[0_8px_18px_rgba(79,70,229,0.22)]">
                      <Rocket size={17} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{app.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <p className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-normal transition-colors duration-300",
                  theme === "light"
                    ? "text-slate-500"
                    : "text-white/40"
                )}>
                  Data Stores
                </p>

                <div className="space-y-2.5">
                  {services.map((service) => (
                    <button
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-md border border-transparent px-3 py-2 text-left text-sm font-semibold transition",
                        theme === "light"
                          ? "text-slate-700 hover:border-slate-300/90 hover:bg-slate-200/90 hover:text-slate-900 hover:shadow-sm"
                          : "text-white/85 hover:border-white/10 hover:bg-white/[0.055] hover:text-white"
                      )}
                      key={service.name}
                      onClick={() => selectSidebarSection("databases")}
                      type="button"
                    >
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-md bg-gradient-to-br shadow-[0_8px_18px_rgba(15,23,42,0.18)]", service.color)}>
                        <service.icon size={17} />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSidebarSection !== "applications" && (
            <div className={cn("rounded-md border p-4 text-sm", theme === "light" ? "border-slate-200 bg-slate-100/90 text-slate-700" : "border-white/10 bg-white/[0.04] text-white/75")}> 
              {activeSidebarSection === "services" && "Service orchestration views and pipeline health will appear here."}
              {activeSidebarSection === "databases" && "Database connections, replicas, and storage health will appear here."}
              {activeSidebarSection === "monitoring" && "Monitoring charts, alerts, and incidents will appear here."}
              {activeSidebarSection === "settings" && "Workspace preferences and account controls will appear here."}
            </div>
          )}
        </div>

        <div
          className={cn(
            "m-6 shrink-0 rounded-xl border border-dashed p-5 text-center text-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5",
            theme === "light"
              ? "border-slate-300/70 bg-gradient-to-b from-white/85 to-slate-100/75 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_32px_rgba(99,102,241,0.08)] hover:border-indigo-300/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_38px_rgba(99,102,241,0.12)]"
              : "border-white/15 bg-white/[0.025] text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_30px_rgba(56,189,248,0.08)] hover:border-cyan-200/25 hover:bg-white/[0.035] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_38px_rgba(56,189,248,0.12)]",
          )}
        >
          <div className="grid min-h-[138px] place-items-center">
            <div>
              <div
                className={cn(
                  "relative mx-auto mb-5 grid size-14 place-items-center rounded-xl border",
                  theme === "light"
                    ? "border-indigo-200/70 bg-white shadow-[0_10px_28px_rgba(99,102,241,0.18)]"
                    : "border-cyan-200/15 bg-white/[0.045] shadow-[0_0_30px_rgba(56,189,248,0.16)]",
                )}
              >
                <Network
                  className={cn(
                    "size-7",
                    theme === "light" ? "text-indigo-500" : "text-cyan-300",
                  )}
                />
                <span
                  className={cn(
                    "absolute -inset-2 -z-10 rounded-xl blur-2xl",
                    theme === "light" ? "bg-indigo-300/45" : "bg-cyan-400/16",
                  )}
                />
              </div>
              <p className={cn("font-semibold leading-5", theme === "light" ? "text-slate-700" : "text-white/78")}>
                Build your infrastructure graph
              </p>
              <p className={cn("mt-2 text-xs leading-5", theme === "light" ? "text-slate-500" : "text-white/45")}>
                Click <span className="font-semibold">+</span> to add a service node
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <AddNodeDialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen} />
    </>
  );
}
