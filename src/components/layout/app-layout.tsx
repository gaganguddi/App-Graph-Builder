import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { LeftRail } from "./left-rail";
import { RightPanel } from "./right-panel";
import { Topbar } from "./topbar";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { getAppGraph, getApps } from "@/mocks/mock-api";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const setGraph = useAppStore((state) => state.setGraph);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const theme = useAppStore((state) => state.theme);

  const appsQuery = useQuery({
    queryKey: ["apps"],
    queryFn: getApps,
  });

  useEffect(() => {
    if (!selectedAppId && appsQuery.data?.apps[0]) {
      setSelectedAppId(appsQuery.data.apps[0].id);
    }
  }, [appsQuery.data, selectedAppId, setSelectedAppId]);

  const graphQuery = useQuery({
    queryKey: ["graph", selectedAppId],
    queryFn: () => getAppGraph(selectedAppId ?? ""),
    enabled: Boolean(selectedAppId),
  });

  useEffect(() => {
    if (graphQuery.data) {
      setGraph(graphQuery.data);
    }
  }, [graphQuery.data, setGraph]);

  return (
    <div className={cn(
      "flex h-screen w-screen overflow-hidden transition-colors duration-300",
      theme === "light"
        ? "bg-slate-50 text-slate-900"
        : "bg-[#020617] text-white"
    )}>
      <LeftRail
        apps={appsQuery.data?.apps ?? []}
        isLoading={appsQuery.isLoading}
        error={appsQuery.error}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar apps={appsQuery.data?.apps ?? []} />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main
            className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
            onClick={() => setSelectedNodeId(null)}
          >
            {graphQuery.isLoading && (
              <div className={cn(
                "absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-md border px-4 py-2 text-sm backdrop-blur transition-colors duration-300",
                theme === "light"
                  ? "border-slate-300 bg-slate-200 text-slate-700"
                  : "border-white/10 bg-black/70 text-white/70"
              )}>
                Loading graph...
              </div>
            )}

            {graphQuery.error && (
              <div className={cn(
                "absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-md border px-4 py-2 text-sm backdrop-blur transition-colors duration-300",
                theme === "light"
                  ? "border-red-300 bg-red-100 text-red-700"
                  : "border-red-400/30 bg-red-950/80 text-red-100"
              )}>
                Unable to load graph.
              </div>
            )}

            <div className="h-full w-full">
              <GraphCanvas />
            </div>
          </main>

          <RightPanel />
        </div>
      </div>
    </div>
  );
}
