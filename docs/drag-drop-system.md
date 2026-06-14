# Drag-and-Drop System

The dashboard supports dynamic infrastructure node creation by dragging technology stack icons directly onto the graph canvas.

This is a premium/bonus feature beyond the original assignment requirements. It turns the graph from a read-only infrastructure view into an interactive architecture builder.

## Supported Draggable Stacks

Users can drag these stack icons from the floating toolbar:

- PostgreSQL
- Redis
- MongoDB
- Docker
- Kubernetes
- GitHub

## User Interaction Flow

1. The user opens the graph dashboard.
2. A floating stack toolbar appears inside the ReactFlow canvas.
3. The user drags a technology stack icon.
4. The user drops it onto the graph canvas.
5. A new infrastructure node is created at the drop position.
6. The new node becomes selected immediately.
7. The node can be inspected, edited, dragged, connected, or deleted.

## Implementation Flow

### 1. Stack Toolbar Drag Start

The stack toolbar lives in:

```text
src/components/graph/stack-toolbar.tsx
```

Each toolbar button is draggable. On drag start, it writes the selected stack kind into `dataTransfer` using the custom MIME key:

```ts
STACK_DRAG_MIME = "application/app-graph-stack"
```

This keeps the drop target explicit and avoids treating unrelated browser drag events as graph node creation.

### 2. ReactFlow Canvas Drop

Drop handling lives in:

```text
src/components/graph/graph-canvas.tsx
```

`GraphCanvas` listens for `onDragOver` and `onDrop` on the ReactFlow component.

On drop:

1. It reads the stack kind from `dataTransfer`.
2. It validates the stack kind against the supported stack list.
3. It uses ReactFlow `screenToFlowPosition` to convert browser coordinates into graph coordinates.
4. It calls Zustand `addStackNode`.

ReactFlow coordinate conversion is important because users may zoom or pan the canvas. Without it, dropped nodes would appear in the wrong place.

### 3. Zustand Node Creation

Graph state lives in:

```text
src/store/app-store.ts
```

The `addStackNode` action creates a new `serviceNode` with:

- unique ID
- ReactFlow position
- stack-specific icon
- service name
- provider
- region
- CPU
- memory
- disk
- status
- description
- logs

The generated node is appended to the current `nodes` array and selected immediately.

### 4. ReactFlow Graph Synchronization

ReactFlow receives `nodes` and `edges` from Zustand. Because generated nodes use the same `serviceNode` type as API-loaded nodes, they automatically support:

- graph rendering
- node dragging
- selection
- inspector synchronization
- edge creation
- keyboard deletion
- inspector deletion
- edge cleanup

No separate graph system is needed for generated nodes.

## Why This Matters

This feature shows more than static API rendering. It demonstrates:

- real ReactFlow canvas interaction
- dynamic node generation
- state synchronization through Zustand
- coordinate conversion for zoomable/pannable canvases
- reusable node rendering
- consistent editing and deletion workflows

In an interview, this is worth highlighting as a polished interaction that makes the project feel closer to production infrastructure tools like Railway, Render, and Supabase Studio.
