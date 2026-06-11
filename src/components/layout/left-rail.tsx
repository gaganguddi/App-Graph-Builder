import {
  Box,
  Code2,
  Database,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Plus,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Workflow,
} from "lucide-react";

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

export function LeftRail({ apps, isLoading, error }: Props) {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const activeSection = useAppStore((state) => state.activeSection);
  const setActiveSection = useAppStore((state) => state.setActiveSection);

  return (
    <aside className="flex min-h-0 shrink-0 border-r border-white/10 bg-[#05070d]/95">
      <div className="hidden w-[72px] flex-col items-center border-r border-white/10 py-5 md:flex">
        {navItems.slice(0, 4).map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
          <button
            className={cn(
              "group relative mb-4 grid size-11 place-items-center rounded-md border border-transparent text-white/70 transition duration-200 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.07] hover:text-white hover:shadow-[0_0_22px_rgba(56,189,248,0.18)]",
              isActive &&
                "border-cyan-300/30 bg-indigo-500 text-white shadow-[0_0_26px_rgba(99,102,241,0.45)]",
            )}
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            title={item.label}
            type="button"
          >
            <Icon size={20} />
            {isActive && (
              <span className="absolute -right-[17px] h-7 w-1 rounded-l-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.75)]" />
            )}
          </button>
          );
        })}

        <div className="mt-auto space-y-3">
          <button
            className={cn(
              "grid size-11 place-items-center rounded-md border border-transparent text-white/70 transition hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.07] hover:text-white",
              activeSection === "settings" &&
                "border-cyan-300/30 bg-indigo-500 text-white shadow-[0_0_26px_rgba(99,102,241,0.45)]",
            )}
            onClick={() => setActiveSection("settings")}
            title="Settings"
            type="button"
          >
            <Settings size={20} />
          </button>

          <button className="grid size-11 place-items-center rounded-md text-white/75 transition hover:bg-white/[0.06] hover:text-white" type="button">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="hidden w-[306px] min-h-0 flex-col bg-[linear-gradient(180deg,rgba(9,13,22,0.96),rgba(5,7,13,0.98))] xl:flex">
        <div className="border-b border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {navItems.find((item) => item.id === activeSection)?.label}
            </h2>
            <button className="grid size-9 place-items-center rounded-md bg-indigo-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.3)]" type="button">
              <Plus size={19} />
            </button>
          </div>

          <label className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white/40">
            <Search size={16} />
            <input
              className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
              placeholder="Search applications..."
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-2">
            {isLoading && (
              <p className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm text-white/50">
                Loading applications...
              </p>
            )}

            {error && (
              <p className="rounded-md border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-100">
                Unable to load apps.
              </p>
            )}

            {apps.map((app) => (
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-md border border-transparent px-2 py-2 text-left text-sm font-semibold text-white/85 transition duration-200 hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
                  selectedAppId === app.id &&
                    "border-cyan-300/20 bg-cyan-400/[0.06] text-white shadow-[inset_0_0_18px_rgba(34,211,238,0.06)]",
                )}
                key={app.id}
                onClick={() => {
                  setActiveSection("applications");
                  setSelectedAppId(app.id);
                }}
                type="button"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                  <Rocket size={17} />
                </span>
                <span className="min-w-0 flex-1 truncate">{app.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-white/40">
              Data Stores
            </p>

            <div className="space-y-2">
              {services.map((service) => (
                <button
                  className="flex w-full items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-left text-sm font-semibold text-white/85 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                  key={service.name}
                  onClick={() => setActiveSection("databases")}
                  type="button"
                >
                  <span className={cn("grid size-9 place-items-center rounded-md bg-gradient-to-br", service.color)}>
                    <service.icon size={17} />
                  </span>
                  {service.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="m-5 grid min-h-[142px] place-items-center rounded-md border border-dashed border-white/25 bg-white/[0.02] p-5 text-center text-sm text-white/50">
          <div>
            <Box className="mx-auto mb-3 size-9 text-white/60" />
            Drag a service to
            <br />
            add to your graph
          </div>
        </div>
      </div>
    </aside>
  );
}
