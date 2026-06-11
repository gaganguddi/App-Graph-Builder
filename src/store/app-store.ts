import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from "reactflow";

import type { GraphPayload, ServiceNode, ServiceNodeData } from "@/types";

type AppStore = {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  activeSection: "applications" | "services" | "databases" | "monitoring" | "settings";
  isMobilePanelOpen: boolean;
  activeInspectorTab: string;
  theme: "dark" | "light";
  nodes: ServiceNode[];
  edges: Edge[];

  setSelectedAppId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setActiveSection: (section: AppStore["activeSection"]) => void;
  setIsMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: string) => void;
  toggleTheme: () => void;
  setGraph: (graph: GraphPayload) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (id: string, data: Partial<ServiceNodeData>) => void;
  deleteSelectedNode: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  activeSection: "applications",
  isMobilePanelOpen: false,
  activeInspectorTab: "metrics",
  theme: "dark",
  nodes: [],
  edges: [],

  setSelectedAppId: (id) =>
    set({
      selectedAppId: id,
      selectedNodeId: null,
      isMobilePanelOpen: false,
    }),

  setSelectedNodeId: (id) =>
    set({
      selectedNodeId: id,
      isMobilePanelOpen: Boolean(id),
    }),

  setActiveSection: (section) =>
    set({
      activeSection: section,
    }),

  setIsMobilePanelOpen: (open) =>
    set({
      isMobilePanelOpen: open,
    }),

  setActiveInspectorTab: (tab) =>
    set({
      activeInspectorTab: tab,
    }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),

  setGraph: (graph) =>
    set({
      nodes: graph.nodes,
      edges: graph.edges,
      selectedNodeId: null,
    }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as ServiceNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          type: "smoothstep",
          style: {
            filter: "drop-shadow(0 0 8px rgba(56,189,248,0.75))",
            stroke: "#38bdf8",
            strokeWidth: 2.5,
          },
        },
        state.edges,
      ),
    })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
          : node,
      ),
    })),

  deleteSelectedNode: () =>
    set((state) => {
      if (!state.selectedNodeId) {
        return state;
      }

      return {
        nodes: state.nodes.filter((node) => node.id !== state.selectedNodeId),
        edges: state.edges.filter(
          (edge) =>
            edge.source !== state.selectedNodeId &&
            edge.target !== state.selectedNodeId,
        ),
        selectedNodeId: null,
        isMobilePanelOpen: false,
      };
    }),
}));
