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

type SidebarSection = "applications" | "services" | "databases" | "monitoring" | "settings";

type AddNodePayload = {
  icon: ServiceNodeData["icon"];
  name: string;
  provider: ServiceNodeData["provider"];
  region: string;
  status: ServiceNodeData["status"];
};

export type StackNodeKind =
  | "github"
  | "postgres"
  | "redis"
  | "mongo"
  | "docker"
  | "kubernetes";

type AddStackNodePayload = {
  kind: StackNodeKind;
  position: {
    x: number;
    y: number;
  };
};

type AppStore = {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  activeSection: SidebarSection;
  activeSidebarSection: SidebarSection;
  activeInspectorTab: string;
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  isSidebarExpanded: boolean;
  isMobileSidebarOpen: boolean;
  nodes: ServiceNode[];
  edges: Edge[];

  setSelectedAppId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setActiveSection: (section: SidebarSection) => void;
  setActiveSidebarSection: (section: SidebarSection) => void;
  selectSidebarSection: (section: SidebarSection) => void;
  setActiveInspectorTab: (tab: string) => void;
  toggleTheme: () => void;
  toggleSidebarCollapsed: () => void;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  setGraph: (graph: GraphPayload) => void;
  addNode: (payload: AddNodePayload) => void;
  addStackNode: (payload: AddStackNodePayload) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (id: string, data: Partial<ServiceNodeData>) => void;
  deleteSelectedNode: () => void;
};

function createNodeId() {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createLogLines(name: string) {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return [
    `${timestamp} ${name} node created`,
    `${timestamp} provisioning workflow queued`,
    `${timestamp} telemetry stream attached`,
  ];
}

function createNodePosition(existingCount: number) {
  const column = existingCount % 3;
  const row = Math.floor(existingCount / 3);

  return {
    x: 120 + column * 380,
    y: 100 + row * 230,
  };
}

function createStackNodeData(kind: StackNodeKind): ServiceNodeData {
  const stackDefaults: Record<StackNodeKind, Omit<ServiceNodeData, "logs">> = {
    github: {
      icon: "github",
      name: "GitHub",
      status: "success",
      cpu: 0.01,
      memory: 0.02,
      disk: 1,
      region: "global",
      provider: "aws",
      description: "Source control integration and deployment trigger endpoint.",
    },
    postgres: {
      icon: "postgres",
      name: "PostgreSQL",
      status: "success",
      cpu: 0.02,
      memory: 0.05,
      disk: 10,
      region: "us-east-1",
      provider: "aws",
      description: "Managed relational datastore for application state.",
    },
    redis: {
      icon: "redis",
      name: "Redis",
      status: "error",
      cpu: 0.02,
      memory: 0.05,
      disk: 5,
      region: "us-east-1",
      provider: "aws",
      description: "In-memory cache and queue coordination layer.",
    },
    mongo: {
      icon: "mongo",
      name: "MongoDB",
      status: "success",
      cpu: 0.04,
      memory: 0.16,
      disk: 12,
      region: "us-east-1",
      provider: "aws",
      description: "Document database for events, snapshots, and flexible records.",
    },
    docker: {
      icon: "docker",
      name: "Docker",
      status: "success",
      cpu: 0.08,
      memory: 0.24,
      disk: 8,
      region: "us-east-1",
      provider: "aws",
      description: "Container runtime layer for packaged service workloads.",
    },
    kubernetes: {
      icon: "kubernetes",
      name: "Kubernetes",
      status: "warning",
      cpu: 0.18,
      memory: 0.7,
      disk: 16,
      region: "us-east-1",
      provider: "aws",
      description: "Cluster orchestration plane for service scaling and scheduling.",
    },
  };

  const data = stackDefaults[kind];

  return {
    ...data,
    logs: createLogLines(data.name),
  };
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  activeSection: "applications",
  activeSidebarSection: "applications",
  activeInspectorTab: "metrics",
  theme: "dark",
  sidebarCollapsed: false,
  isSidebarExpanded: true,
  isMobileSidebarOpen: false,
  nodes: [],
  edges: [],

  setSelectedAppId: (id) =>
    set({
      selectedAppId: id,
      selectedNodeId: null,
    }),

  setSelectedNodeId: (id) =>
    set({
      selectedNodeId: id,
    }),

  setActiveSection: (section) =>
    set({
      activeSection: section,
      activeSidebarSection: section,
      isSidebarExpanded: true,
      sidebarCollapsed: false,
    }),

  setActiveSidebarSection: (section) =>
    set({
      activeSection: section,
      activeSidebarSection: section,
      isSidebarExpanded: true,
      sidebarCollapsed: false,
    }),

  selectSidebarSection: (section) =>
    set((state) => {
      const isActiveSection = state.activeSidebarSection === section;

      if (isActiveSection && state.isSidebarExpanded) {
        return {
          sidebarCollapsed: true,
          isSidebarExpanded: false,
        };
      }

      return {
        activeSection: section,
        activeSidebarSection: section,
        sidebarCollapsed: false,
        isSidebarExpanded: true,
      };
    }),

  setActiveInspectorTab: (tab) =>
    set({
      activeInspectorTab: tab,
    }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),

  toggleSidebarCollapsed: () =>
    set((state) => {
      const nextExpanded = !state.isSidebarExpanded;

      return {
        sidebarCollapsed: !nextExpanded,
        isSidebarExpanded: nextExpanded,
      };
    }),

  toggleSidebar: () =>
    set((state) => {
      const nextExpanded = !state.isSidebarExpanded;

      return {
        sidebarCollapsed: !nextExpanded,
        isSidebarExpanded: nextExpanded,
      };
    }),

  collapseSidebar: () =>
    set({
      sidebarCollapsed: true,
      isSidebarExpanded: false,
    }),

  expandSidebar: () =>
    set({
      sidebarCollapsed: false,
      isSidebarExpanded: true,
    }),

  openMobileSidebar: () =>
    set({
      isMobileSidebarOpen: true,
    }),

  closeMobileSidebar: () =>
    set({
      isMobileSidebarOpen: false,
    }),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  setGraph: (graph) =>
    set({
      nodes: graph.nodes,
      edges: graph.edges,
      selectedNodeId: null,
    }),

  addNode: (payload) =>
    set((state) => {
      const id = createNodeId();

      const newNode: ServiceNode = {
        id,
        type: "serviceNode",
        position: createNodePosition(state.nodes.length),
        data: {
          icon: payload.icon,
          name: payload.name,
          status: payload.status,
          cpu: 0.1,
          memory: 0.25,
          disk: 5,
          region: payload.region,
          provider: payload.provider,
          description: `${payload.name} service deployed in ${payload.region}.`,
          logs: createLogLines(payload.name),
        },
      };

      return {
        nodes: [...state.nodes, newNode],
        selectedNodeId: id,
      };
    }),

  addStackNode: (payload) =>
    set((state) => {
      const id = createNodeId();
      const newNode: ServiceNode = {
        id,
        type: "serviceNode",
        position: payload.position,
        data: createStackNodeData(payload.kind),
      };

      return {
        nodes: [...state.nodes, newNode],
        selectedNodeId: id,
      };
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
          pathOptions: {
            borderRadius: 18,
            offset: 36,
          },
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
      };
    }),
}));
