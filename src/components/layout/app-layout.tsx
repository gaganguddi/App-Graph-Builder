import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { LeftRail } from "./left-rail";
import { RightPanel } from "./right-panel";
import { Topbar } from "./topbar";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { getAppGraph, getApps } from "@/mocks/mock-api";
import { useAppStore } from "@/store/app-store";

export function AppLayout() {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const setGraph = useAppStore((state) => state.setGraph);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

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
    <div className="flex h-screen w-screen overflow-hidden bg-[#020617] text-white">
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
              <div className="absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-md border border-white/10 bg-black/70 px-4 py-2 text-sm text-white/70 backdrop-blur">
                Loading graph...
              </div>
            )}

            {graphQuery.error && (
              <div className="absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-md border border-red-400/30 bg-red-950/80 px-4 py-2 text-sm text-red-100 backdrop-blur">
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
