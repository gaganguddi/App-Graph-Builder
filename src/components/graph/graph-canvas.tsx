import { useCallback, useEffect, useMemo, useRef, type DragEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "reactflow";

import type { Edge, NodeTypes } from "reactflow";
import type { ReactFlowInstance } from "reactflow";

import { ServiceNode } from "./service-node";
import { StackToolbar, STACK_DRAG_MIME } from "./stack-toolbar";
import { useAppStore, type StackNodeKind } from "@/store/app-store";

const nodeTypes = {
  serviceNode: ServiceNode,
} satisfies NodeTypes;

const SIDEBAR_TRANSITION_MS = 300;
const smoothstepPathOptions = {
  borderRadius: 18,
  offset: 36,
};

type EdgeWithSmoothstepOptions = Edge & {
  pathOptions?: typeof smoothstepPathOptions;
};

type SmoothstepDefaultEdgeOptions = {
  animated: boolean;
  type: "smoothstep";
  pathOptions: typeof smoothstepPathOptions;
  style: {
    stroke: string;
    strokeWidth: number;
  };
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
  pathOptions: smoothstepPathOptions,
  style: { stroke: "#38bdf8", strokeWidth: 2.5 },
} satisfies SmoothstepDefaultEdgeOptions;

const fitViewOptions = { padding: 0.28 };
const proOptions = { hideAttribution: true };
const deleteKeyCode = ["Delete", "Backspace"];

function handleReactFlowError(code: string, message: string) {
  if (code === "002") {
    return;
  }

  console.warn(message);
}

const stackNodeKinds: StackNodeKind[] = [
  "github",
  "postgres",
  "redis",
  "mongo",
  "docker",
  "kubernetes",
];

function isStackNodeKind(value: string): value is StackNodeKind {
  return stackNodeKinds.includes(value as StackNodeKind);
}

function ResizeAwareCanvas() {
  const { fitView } = useReactFlow();
  const isSidebarExpanded = useAppStore((state) => state.isSidebarExpanded);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      fitView({ padding: 0.22, duration: SIDEBAR_TRANSITION_MS });
    });

    const timer = window.setTimeout(() => {
      fitView({ padding: 0.22, duration: 200 });
    }, SIDEBAR_TRANSITION_MS + 20);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [fitView, isSidebarExpanded, selectedNodeId]);

  return null;
}

export function GraphCanvas() {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const nodes = useAppStore((state) => state.nodes);
  const edges = useAppStore((state) => state.edges);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const onNodesChange = useAppStore((state) => state.onNodesChange);
  const onEdgesChange = useAppStore((state) => state.onEdgesChange);
  const onConnect = useAppStore((state) => state.onConnect);
  const addStackNode = useAppStore((state) => state.addStackNode);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const deleteSelectedNode = useAppStore((state) => state.deleteSelectedNode);
  const theme = useAppStore((state) => state.theme);

  // Handle delete key for selected nodes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedNodeId) {
        event.preventDefault();
        deleteSelectedNode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, deleteSelectedNode]);

  const bgStyle = theme === "light"
    ? "bg-[linear-gradient(135deg,rgba(59,130,246,0.05),transparent_55%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]"
    : "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),#080b12]";

  const dotColor = theme === "light" ? "rgba(100,116,139,0.28)" : "rgba(148,163,184,0.22)";
  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        const smoothstepEdge = edge as EdgeWithSmoothstepOptions;

        return {
          ...smoothstepEdge,
          pathOptions: {
            ...smoothstepPathOptions,
            ...smoothstepEdge.pathOptions,
          },
          style: {
            stroke: "#38bdf8",
            strokeWidth: 2.5,
            filter: "drop-shadow(0 0 12px rgba(56,189,248,0.6))",
            ...smoothstepEdge.style,
          },
        };
      }),
    [edges],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const stackKind = event.dataTransfer.getData(STACK_DRAG_MIME);

      if (!isStackNodeKind(stackKind)) {
        return;
      }

      const dropPosition = reactFlowInstance.current?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!dropPosition) {
        return;
      }

      addStackNode({
        kind: stackKind,
        position: {
          x: dropPosition.x - 219,
          y: dropPosition.y - 90,
        },
      });
    },
    [addStackNode],
  );

  return (
    <div className={`h-full w-full transition-colors duration-300 ${bgStyle}`}>
      <ReactFlow
        className="h-full w-full"
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={fitViewOptions}
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onNodesChange={onNodesChange}
        onPaneClick={() => setSelectedNodeId(null)}
        onError={handleReactFlowError}
        proOptions={proOptions}
        deleteKeyCode={deleteKeyCode}
      >
        <StackToolbar />
        <ResizeAwareCanvas />
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.4}
          color={dotColor}
        />

        <Controls
          className={
            theme === "light"
              ? "!bottom-auto !left-auto !right-6 !top-6 overflow-hidden !rounded-md !border !border-slate-200/80 !bg-white/80 !text-slate-700 !shadow-lg !shadow-slate-200/60 !backdrop-blur"
              : "!bottom-auto !left-auto !right-6 !top-6 overflow-hidden !rounded-md !border !border-white/10 !bg-black/40 !shadow-2xl !backdrop-blur"
          }
          showInteractive={false}
        />
        <MiniMap
          className={
            theme === "light"
              ? "!bottom-4 !right-4 !h-[120px] !w-[180px] !rounded-md !border !border-slate-200/80 !bg-white/80 !shadow-lg !shadow-slate-200/50 !backdrop-blur"
              : "!bottom-4 !right-4 !h-[120px] !w-[180px] !rounded-md !border !border-white/10 !bg-black/40 !backdrop-blur"
          }
          maskColor={theme === "light" ? "rgba(241,245,249,0.82)" : "rgba(2,6,23,0.72)"}
          nodeColor="#818cf8"
          nodeStrokeColor={theme === "light" ? "#6366f1" : "#c7d2fe"}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
