import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "reactflow";

import type { NodeTypes } from "reactflow";

import { ServiceNode } from "./service-node";
import { useAppStore } from "@/store/app-store";

const nodeTypes = {
  serviceNode: ServiceNode,
} satisfies NodeTypes;

export function GraphCanvas() {
  const nodes = useAppStore((state) => state.nodes);
  const edges = useAppStore((state) => state.edges);
  const onNodesChange = useAppStore((state) => state.onNodesChange);
  const onEdgesChange = useAppStore((state) => state.onEdgesChange);
  const onConnect = useAppStore((state) => state.onConnect);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  return (
    <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),#080b12]">
      <ReactFlow
        className="h-full w-full"
        defaultEdgeOptions={{
          animated: true,
          type: "smoothstep",
          style: { stroke: "#38bdf8", strokeWidth: 2 },
        }}
        fitView
        fitViewOptions={{ padding: 0.28 }}
        nodes={nodes}
        edges={edges.map((edge) => ({
          ...edge,
          style: { stroke: "#38bdf8", strokeWidth: 2, ...edge.style },
        }))}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onNodesChange={onNodesChange}
        onPaneClick={() => setSelectedNodeId(null)}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.4}
          color="rgba(148,163,184,0.22)"
        />

        <Controls
          className="!bottom-auto !left-auto !right-6 !top-6 overflow-hidden !rounded-md !border !border-white/10 !bg-black/40 !shadow-2xl !backdrop-blur"
          showInteractive={false}
        />
        <MiniMap
          className="!bottom-4 !right-4 !h-[120px] !w-[180px] !rounded-md !border !border-white/10 !bg-black/40 !backdrop-blur"
          maskColor="rgba(2,6,23,0.72)"
          nodeColor="#818cf8"
          nodeStrokeColor="#c7d2fe"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
