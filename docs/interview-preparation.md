# Interview Preparation

This document summarizes how to explain the Infrastructure Graph Dashboard in an interview.

## Short Project Pitch

Infrastructure Graph Dashboard is a React and TypeScript dashboard for visualizing application infrastructure as an interactive graph. It uses ReactFlow for graph rendering, Zustand for client-side graph state, TanStack Query for server-state fetching and caching, and MSW for mock API interception.

The dashboard supports app switching, graph visualization, node inspection, node editing, node deletion, theme switching, and dynamic infrastructure node creation by dragging technology stack icons directly onto the graph canvas.

## What Makes It Strong

- It uses real `fetch()` calls instead of hardcoded local-only data paths.
- MSW intercepts `/api/apps` and `/api/apps/:appId/graph` during development.
- TanStack Query handles loading, error, caching, and refetch behavior.
- Zustand centralizes graph interaction state.
- ReactFlow is controlled through Zustand, making node and edge updates predictable.
- The inspector edits the same node data rendered in the graph.
- Drag-and-drop stack creation adds an interactive architecture-builder workflow.

## Premium Feature To Highlight

The dashboard supports dynamic infrastructure node creation by dragging technology stack icons directly onto the graph canvas.

Users can drag:

- PostgreSQL
- Redis
- MongoDB
- Docker
- Kubernetes
- GitHub

When a stack icon is dropped on the ReactFlow canvas, the app dynamically creates an infrastructure node at that position. The node is stored in Zustand, rendered by ReactFlow, selected immediately, and works with the same inspector, editing, deletion, and edge systems as API-loaded nodes.

This is a premium/bonus feature because it goes beyond a static graph viewer. It makes the app feel like an infrastructure composition tool.

## Architecture Explanation

### Server State

TanStack Query owns server-state fetching:

- `["apps"]` fetches `/api/apps`
- `["graph", selectedAppId]` fetches `/api/apps/:appId/graph`

When the selected app changes, the graph query key changes and TanStack Query refetches the correct graph.

### Client Interaction State

Zustand owns client-side graph interaction state:

- selected app ID
- selected node ID
- nodes
- edges
- theme
- sidebar state
- inspector tab state

This separation keeps API fetching and UI interaction state clear.

### Graph State

ReactFlow is rendered as a controlled graph:

- `nodes` come from Zustand
- `edges` come from Zustand
- `onNodesChange` updates Zustand
- `onEdgesChange` updates Zustand
- `onConnect` adds edges through Zustand

Generated drag/drop nodes and API-loaded nodes share the same graph state.

### Inspector Sync

The inspector stores no duplicate node copy. It reads `selectedNodeId`, finds the matching node in Zustand, and writes edits back through `updateNodeData`.

That means the graph card and inspector stay synchronized.

## Drag-and-Drop Explanation

The drag/drop system has three parts:

1. `StackToolbar` defines draggable stack buttons.
2. `GraphCanvas` handles drop events and converts screen coordinates with ReactFlow.
3. Zustand `addStackNode` creates the new graph node.

This flow keeps the toolbar simple, the canvas responsible for coordinate conversion, and the store responsible for graph mutation.

## Deletion Explanation

Node deletion is centralized in Zustand:

- keyboard Delete and Backspace call `deleteSelectedNode`
- inspector delete confirmation also calls `deleteSelectedNode`

The store removes:

- the selected node
- every edge connected to that node
- the selected node state

This avoids duplicated deletion logic.

## Good Interview Answers

**Why ReactFlow?**

ReactFlow provides production-ready graph interactions: custom nodes, dragging, connecting, zooming, panning, minimap, controls, and coordinate conversion. That let the project focus on dashboard behavior and infrastructure UX instead of building graph mechanics from scratch.

**Why Zustand?**

Zustand is small and direct. It works well for UI interaction state like selected node, nodes, edges, sidebar state, and theme. It also keeps graph mutations easy to reason about.

**Why TanStack Query?**

TanStack Query is better suited for server state than storing API responses manually. It provides caching, loading states, error states, retries, and refetching when the selected app changes.

**Why MSW?**

MSW allows the frontend to make real `fetch()` requests while still using mock data. This makes the Network tab realistic and keeps the app close to how it would integrate with a backend later.

**What is the standout feature?**

The draggable stack toolbar. Users can drag technology icons onto the graph canvas and dynamically create editable infrastructure nodes. The generated nodes are fully integrated with ReactFlow and Zustand.

## Demo Flow

1. Open the dashboard and let the splash screen finish.
2. Show the graph canvas, minimap, and service nodes.
3. Switch between apps from the topbar selector.
4. Select a node and edit metrics/config in the inspector.
5. Drag a PostgreSQL, Redis, Docker, Kubernetes, MongoDB, or GitHub icon onto the canvas.
6. Show that the generated node appears where dropped.
7. Edit the generated node in the inspector.
8. Delete the node from the inspector confirmation dialog.
9. Toggle between dark and light themes.

## Key Takeaway

This project is not only a visual dashboard. It combines API-driven graph rendering with interactive infrastructure composition, making it a strong demonstration of frontend architecture, state management, and product-quality UI polish.
