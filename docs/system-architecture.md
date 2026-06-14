# System Architecture

This document explains how the Infrastructure Graph Dashboard works internally. It is written for recruiters, interviewers, reviewers, and developers who want to understand the actual implementation in this repository.

The dashboard is a frontend-only React application that renders infrastructure graphs with ReactFlow, manages graph interaction state with Zustand, fetches mock API data through TanStack Query, and intercepts real browser `fetch()` requests with MSW in development.

## High-Level Summary

The project is organized around four major concerns:

- **Server state:** TanStack Query fetches app and graph data through real `fetch()` calls.
- **Mock API layer:** MSW intercepts `/api/apps` and `/api/apps/:appId/graph` in development.
- **Client interaction state:** Zustand stores selected app, selected node, graph nodes, graph edges, sidebar state, inspector tab state, and theme.
- **Graph rendering:** ReactFlow renders controlled nodes and edges from Zustand and reports graph interactions back into the store.

## Overall System Architecture

```mermaid
flowchart TD
  User[User] --> UI[React UI]

  UI --> Layout[AppLayout]
  Layout --> LeftRail[LeftRail Sidebar]
  Layout --> Topbar[Topbar App Selector]
  Layout --> GraphCanvas[ReactFlow GraphCanvas]
  Layout --> RightPanel[Inspector / RightPanel]

  Topbar --> Zustand[Zustand Store]
  LeftRail --> Zustand
  GraphCanvas --> Zustand
  RightPanel --> Zustand

  Layout --> Query[TanStack Query]
  Query --> Fetch[fetch API]
  Fetch --> AppsAPI["/api/apps"]
  Fetch --> GraphAPI["/api/apps/:appId/graph"]

  AppsAPI --> MSW[MSW Worker]
  GraphAPI --> MSW
  MSW --> Handlers[Mock Handlers]
  Handlers --> MockData[Mock Apps + Graph Payloads]
  MockData --> Query

  Query --> Zustand
  Zustand --> GraphCanvas
  GraphCanvas --> ServiceNode[ServiceNode Components]
  GraphCanvas --> StackToolbar[Draggable Stack Toolbar]
  Zustand --> RightPanel

  UI --> Theme[Theme System]
  Theme --> LocalStorage[localStorage]
  Theme --> TailwindClasses[Theme-aware Tailwind Classes]

  RightPanel --> ResponsiveDrawer[Mobile Inspector Overlay]
```

## Application Start Flow

1. Vite loads `src/main.tsx`.
2. A TanStack Query `QueryClient` is created.
3. In development, `enableMocking()` dynamically imports `src/mocks/browser.ts`.
4. MSW starts before React renders.
5. React renders `App` inside `QueryClientProvider`.
6. `App` loads persisted theme from `localStorage`.
7. `App` shows the premium splash screen briefly.
8. `AppLayout` mounts.
9. `AppLayout` runs the `["apps"]` query.
10. `getApps()` calls `fetch("/api/apps")`.
11. MSW intercepts the request and returns mock apps.
12. If no app is selected, the first app becomes `selectedAppId` in Zustand.
13. The graph query `["graph", selectedAppId]` becomes enabled.
14. `getAppGraph()` calls `fetch("/api/apps/:appId/graph")`.
15. MSW returns the graph payload.
16. `setGraph()` stores nodes and edges in Zustand.
17. `GraphCanvas` renders the ReactFlow graph.
18. `RightPanel` stays closed until a node is selected.

```mermaid
sequenceDiagram
  participant Browser
  participant Main as main.tsx
  participant MSW as MSW Worker
  participant React as React App
  participant Query as TanStack Query
  participant Store as Zustand Store
  participant Flow as ReactFlow

  Browser->>Main: Load Vite entry
  Main->>MSW: Start worker in DEV
  MSW-->>Main: Worker ready
  Main->>React: Render App
  React->>Query: useQuery(["apps"])
  Query->>MSW: fetch("/api/apps")
  MSW-->>Query: apps JSON
  Query-->>React: apps data
  React->>Store: setSelectedAppId(first app)
  React->>Query: useQuery(["graph", selectedAppId])
  Query->>MSW: fetch("/api/apps/:appId/graph")
  MSW-->>Query: graph JSON
  React->>Store: setGraph(nodes, edges)
  Store-->>Flow: controlled nodes + edges
  Flow-->>Browser: Render graph
```

## Frontend Component Hierarchy

```mermaid
flowchart TD
  App[App.tsx]
  App --> TooltipProvider[TooltipProvider]
  TooltipProvider --> AppLayout[AppLayout]

  AppLayout --> LeftRail[LeftRail]
  AppLayout --> Topbar[Topbar]
  AppLayout --> Main[Main Graph Area]
  AppLayout --> RightPanel[RightPanel Inspector]

  LeftRail --> AddNodeDialog[AddNodeDialog]
  Main --> GraphCanvas[GraphCanvas]
  GraphCanvas --> ReactFlow[ReactFlow]
  ReactFlow --> ServiceNode[ServiceNode]
  ReactFlow --> StackToolbar[StackToolbar]
  ReactFlow --> Controls[ReactFlow Controls]
  ReactFlow --> MiniMap[ReactFlow MiniMap]
  ReactFlow --> Background[Dotted Background]

  RightPanel --> InspectorTabs[Metrics / Config / Logs Tabs]
  RightPanel --> AlertDialog[Delete Confirmation]

  AppLayout --> Store[Zustand Store]
  AppLayout --> Query[TanStack Query]
```

## API Request Flow

The project intentionally uses real `fetch()` calls. Mock data is not read directly by components. The app-facing API functions live in `src/mocks/mock-api.ts`, but they call network endpoints:

- `fetch("/api/apps")`
- `fetch("/api/apps/${appId}/graph")`

In development, MSW intercepts those requests.

```mermaid
flowchart TD
  Component[AppLayout Component] --> UseQuery[useQuery]
  UseQuery --> QueryFn[getApps / getAppGraph]
  QueryFn --> Fetch[Browser fetch]
  Fetch --> Endpoint{Endpoint}
  Endpoint --> Apps["GET /api/apps"]
  Endpoint --> Graph["GET /api/apps/:appId/graph"]
  Apps --> MSW[MSW Interception]
  Graph --> MSW
  MSW --> Handlers[handlers.ts]
  Handlers --> Data[mockApps / mockGraphs]
  Data --> JSON[JSON Response]
  JSON --> Cache[TanStack Query Cache]
  Cache --> AppLayout[AppLayout]
  AppLayout --> Store[setGraph / setSelectedAppId]
  Store --> ReactFlow[ReactFlow Graph Update]
```

## MSW Mock API Interception

MSW is started only in development from `src/main.tsx`:

```ts
const { worker } = await import("./mocks/browser");
await worker.start({ onUnhandledRequest: "bypass" });
```

The worker is created in `src/mocks/browser.ts` using:

```ts
setupWorker(...handlers)
```

The handlers are in `src/mocks/handlers.ts`.

```mermaid
sequenceDiagram
  participant UI as React UI
  participant Query as TanStack Query
  participant Fetch as fetch()
  participant Worker as MSW Worker
  participant Handler as Mock Handler
  participant Data as Mock Data

  UI->>Query: Request apps or graph
  Query->>Fetch: fetch("/api/...")
  Fetch->>Worker: Request intercepted in DEV
  Worker->>Handler: Match route
  Handler->>Data: Read mockApps/mockGraphs
  Data-->>Handler: Payload
  Handler-->>Worker: HttpResponse.json(...)
  Worker-->>Fetch: Mocked response
  Fetch-->>Query: JSON
  Query-->>UI: Cached data
```

## Zustand State Flow

Zustand is the source of truth for graph interaction state.

Important store fields:

- `selectedAppId`
- `selectedNodeId`
- `nodes`
- `edges`
- `theme`
- `activeSidebarSection`
- `activeInspectorTab`
- `isSidebarExpanded`

Important actions:

- `setSelectedAppId`
- `setSelectedNodeId`
- `setGraph`
- `addNode`
- `addStackNode`
- `onNodesChange`
- `onEdgesChange`
- `onConnect`
- `updateNodeData`
- `deleteSelectedNode`
- `toggleTheme`

```mermaid
flowchart TD
  Interaction[User Interaction] --> Action[Zustand Action]
  Action --> StoreUpdate[Store Update]
  StoreUpdate --> Subscribers[Selective Component Subscriptions]
  Subscribers --> ReactFlowSync[ReactFlow Sync]
  Subscribers --> InspectorSync[Inspector Sync]
  Subscribers --> LayoutSync[Sidebar / Theme / Topbar Sync]
  ReactFlowSync --> UIUpdate[UI Rerender]
  InspectorSync --> UIUpdate
  LayoutSync --> UIUpdate
```

## ReactFlow Rendering Pipeline

`GraphCanvas` renders ReactFlow as a controlled graph:

- `nodes` come from Zustand.
- `edges` come from Zustand.
- `nodeTypes` is defined outside render and maps `serviceNode` to `ServiceNode`.
- `defaultEdgeOptions`, `fitViewOptions`, and `proOptions` are stable module-level constants.
- Edge styling is memoized with `useMemo`.

```mermaid
flowchart TD
  StoreNodes[Zustand nodes] --> GraphCanvas[GraphCanvas]
  StoreEdges[Zustand edges] --> GraphCanvas
  GraphCanvas --> StyledEdges[Memoized styledEdges]
  GraphCanvas --> ReactFlow[ReactFlow Component]
  ReactFlow --> ServiceNode[Custom ServiceNode Renderer]
  ReactFlow --> Edges[Smoothstep Animated Edges]
  ReactFlow --> Controls[Controls + MiniMap + Background]

  ReactFlow --> NodeDrag[Node Drag]
  NodeDrag --> onNodesChange[onNodesChange]
  onNodesChange --> StoreNodes

  ReactFlow --> EdgeChange[Edge Change]
  EdgeChange --> onEdgesChange[onEdgesChange]
  onEdgesChange --> StoreEdges

  ReactFlow --> Connect[Connect Nodes]
  Connect --> onConnect[onConnect]
  onConnect --> StoreEdges

  ReactFlow --> Selection[Node Selection]
  Selection --> setSelectedNodeId[setSelectedNodeId]
  setSelectedNodeId --> Inspector[Inspector Opens]
```

## App Switching Workflow

Users can switch applications from the topbar selector or sidebar app list.

```mermaid
sequenceDiagram
  participant User
  participant Topbar
  participant Store as Zustand Store
  participant Query as TanStack Query
  participant MSW
  participant Graph as ReactFlow
  participant Inspector

  User->>Topbar: Select application
  Topbar->>Store: setSelectedAppId(app.id)
  Store->>Store: selectedNodeId = null
  Store-->>Query: selectedAppId changes query key
  Query->>MSW: fetch("/api/apps/:appId/graph")
  MSW-->>Query: graph payload
  Query-->>Store: setGraph(graph)
  Store-->>Graph: new nodes + edges
  Store-->>Inspector: selectedNodeId cleared
  Graph-->>User: New app graph rendered
```

## Node Selection Flow

Node selection is driven by ReactFlow click events and Zustand state.

```mermaid
flowchart TD
  User[User clicks node] --> ReactFlowClick[ReactFlow onNodeClick]
  ReactFlowClick --> StoreAction[setSelectedNodeId(node.id)]
  StoreAction --> Store[Zustand selectedNodeId]
  Store --> RightPanel[RightPanel reads selected node]
  RightPanel --> Tabs[Metrics / Config / Logs]
  RightPanel --> Inputs[Editable Inputs + Sliders]
  Inputs --> UpdateAction[updateNodeData]
  UpdateAction --> Store
  Store --> ServiceNode[ServiceNode rerenders]
```

## Inspector Synchronization

The inspector does not keep a separate copy of node data. It derives the selected node from Zustand:

1. `RightPanel` reads `selectedNodeId`.
2. It finds the matching node in `nodes`.
3. Inputs and sliders display the selected node data.
4. Edits call `updateNodeData`.
5. Zustand updates the node.
6. ReactFlow rerenders the same node card with updated data.

```mermaid
sequenceDiagram
  participant Inspector
  participant Store as Zustand Store
  participant Node as ServiceNode
  participant Flow as ReactFlow

  Inspector->>Store: Read selectedNodeId + nodes
  Store-->>Inspector: Selected node data
  Inspector->>Store: updateNodeData(id, patch)
  Store->>Store: Merge node data
  Store-->>Flow: Updated nodes array
  Flow-->>Node: Rerender service node
  Store-->>Inspector: Updated inspector values
```

## Drag-and-Drop Workflow

The dashboard supports dynamic infrastructure node creation by dragging technology stack icons directly onto the graph canvas.

Supported stack icons:

- PostgreSQL
- Redis
- MongoDB
- Docker
- Kubernetes
- GitHub

```mermaid
flowchart TD
  User[User drags stack icon] --> Toolbar[StackToolbar]
  Toolbar --> DataTransfer[Set STACK_DRAG_MIME in dataTransfer]
  DataTransfer --> CanvasDrop[Drop on ReactFlow Canvas]
  CanvasDrop --> Validate[Validate stack kind]
  Validate --> Coordinates[screenToFlowPosition]
  Coordinates --> AddStackNode[Zustand addStackNode]
  AddStackNode --> GenerateData[Generate service node data]
  GenerateData --> StoreNodes[Append to Zustand nodes]
  StoreNodes --> SelectNew[Set selectedNodeId to new node]
  StoreNodes --> ReactFlow[ReactFlow rerenders]
  SelectNew --> Inspector[Inspector can edit new node]
```

Implementation files:

- `src/components/graph/stack-toolbar.tsx`
- `src/components/graph/graph-canvas.tsx`
- `src/store/app-store.ts`

Why it works well:

- `StackToolbar` only owns drag source behavior.
- `GraphCanvas` owns canvas drop handling and coordinate conversion.
- Zustand owns graph mutation.
- `ServiceNode` renders generated nodes the same way it renders API-loaded nodes.

## Node Delete Flow

Deletion is centralized in Zustand so keyboard deletion and inspector deletion share the same behavior.

```mermaid
flowchart TD
  DeleteIntent[Delete button or Delete/Backspace key] --> Confirm{Inspector button?}
  Confirm -->|Yes| Dialog[Confirmation Dialog]
  Confirm -->|No| StoreDelete[deleteSelectedNode]
  Dialog --> StoreDelete
  StoreDelete --> RemoveNode[Remove selected node]
  RemoveNode --> RemoveEdges[Remove connected edges]
  RemoveEdges --> ClearSelection[selectedNodeId = null]
  ClearSelection --> GraphUpdate[ReactFlow rerenders]
  ClearSelection --> InspectorClose[Inspector closes]
```

## Theme System Flow

Theme state is stored in Zustand and persisted to `localStorage`.

```mermaid
flowchart TD
  User[Theme toggle clicked] --> Toggle[toggleTheme]
  Toggle --> Store[Zustand theme update]
  Store --> AppEffect[App.tsx effect]
  AppEffect --> LocalStorage[localStorage app-theme]
  AppEffect --> HtmlClass[html.light class toggle]
  HtmlClass --> Tailwind[Theme-aware Tailwind classes]
  Tailwind --> UI[Dashboard rerender]
  LocalStorage --> Reload[Theme restored on reload]
```

Implementation details:

- `App.tsx` persists the theme.
- `Topbar` calls `toggleTheme`.
- Components read `theme` from Zustand and apply theme-specific class names.
- Light mode adds the `light` class to `document.documentElement`.

## Responsive UI Behavior

The layout uses responsive Tailwind classes and state-driven sidebar behavior.

Key behavior:

- The left icon rail remains compact.
- The expanded app/sidebar panel can collapse and expand.
- The inspector is static on large screens and becomes a fixed overlay on smaller screens.
- The mobile overlay uses a backdrop so users can close the inspector by clicking outside it.
- Graph fit view runs after sidebar and selection changes to keep nodes framed.

```mermaid
flowchart TD
  Viewport[Viewport Size] --> Layout{Desktop or Mobile}
  Layout -->|Desktop XL| StaticInspector[Inspector as right panel]
  Layout -->|Mobile/Tablet| OverlayInspector[Inspector as fixed overlay]
  SidebarState[isSidebarExpanded] --> LeftRail[LeftRail width transition]
  SidebarState --> FitView[ReactFlow fitView]
  SelectedNode[selectedNodeId] --> InspectorVisibility[Inspector open/closed]
```

## Performance Notes

The implementation includes several practical performance decisions:

- **Stable ReactFlow config:** `nodeTypes`, `defaultEdgeOptions`, `fitViewOptions`, and `proOptions` are defined outside component renders.
- **No custom edgeTypes churn:** the app uses built-in ReactFlow smoothstep edges and does not pass unnecessary custom `edgeTypes`.
- **Memoized styled edges:** `styledEdges` is memoized from the Zustand `edges` array.
- **Selective Zustand subscriptions:** components subscribe to only the state slices they need.
- **TanStack Query caching:** app and graph responses are cached by query key.
- **Controlled graph state:** ReactFlow changes are applied through Zustand actions instead of scattered local state.
- **Fit view timing:** `ResizeAwareCanvas` uses requestAnimationFrame and timeout after sidebar transitions to avoid abrupt graph framing.
- **MSW in development only:** production builds are not blocked by the mock worker.
- **CSS transitions:** visual polish uses Tailwind/CSS transitions instead of heavy runtime animation dependencies.

## How to Explain the Architecture in Interviews

### Why Zustand Instead of Redux?

Zustand is lightweight and direct. The project needs shared UI interaction state, not a large event/action architecture. Zustand keeps graph mutations readable:

- `setGraph`
- `addStackNode`
- `updateNodeData`
- `deleteSelectedNode`

It also avoids boilerplate while still making state flow explicit.

### Why TanStack Query?

TanStack Query is designed for server state. It handles:

- fetching
- loading states
- error states
- retry behavior
- caching
- graph refetching when `selectedAppId` changes

This keeps API data concerns separate from local graph interaction state.

### Why MSW?

MSW allows the frontend to make real browser `fetch()` requests while still using mock data. This means DevTools shows realistic Fetch/XHR traffic:

- `/api/apps`
- `/api/apps/:appId/graph`

It also makes the app easier to replace with a real backend later because components already use API calls.

### Why ReactFlow?

ReactFlow provides graph interactions that would be expensive to build from scratch:

- custom nodes
- node dragging
- edge rendering
- connection handling
- zoom/pan
- minimap
- controls
- coordinate conversion for drag/drop

The project uses ReactFlow for the graph engine and focuses custom work on infrastructure-specific UX.

### Scalability Discussion

The current architecture can scale by:

- adding more MSW handlers or replacing them with real backend endpoints
- adding more node types to `ServiceNodeData`
- adding custom ReactFlow edge types if needed
- persisting graph edits to an API
- extending Zustand actions for duplication, grouping, or node templates
- adding query invalidation after backend mutations

### Component Separation Strategy

The dashboard keeps responsibilities separated:

- `AppLayout` composes the shell and owns data queries.
- `GraphCanvas` owns ReactFlow interactions.
- `ServiceNode` owns visual node rendering.
- `StackToolbar` owns drag sources.
- `RightPanel` owns selected-node editing.
- Zustand owns graph mutations.
- MSW owns mock API responses.

This separation makes the project easier to evaluate, maintain, and extend.

## End-to-End Workflow Summary

```mermaid
flowchart LR
  Start[App Starts] --> MSW[MSW Starts in DEV]
  MSW --> Apps[Fetch Apps]
  Apps --> SelectApp[Select Initial App]
  SelectApp --> GraphFetch[Fetch Graph]
  GraphFetch --> Store[Store Nodes/Edges in Zustand]
  Store --> Render[ReactFlow Renders Graph]
  Render --> Interact[User Interacts]
  Interact --> Select[Select Node]
  Interact --> DragDrop[Drag Stack to Canvas]
  Interact --> Switch[Switch App]
  Interact --> Theme[Toggle Theme]
  Interact --> Delete[Delete Node]
  Select --> Inspector[Inspector Sync]
  DragDrop --> Store
  Switch --> GraphFetch
  Theme --> Store
  Delete --> Store
```

## Final Notes

This architecture intentionally separates API data, graph interaction state, and visual rendering:

- TanStack Query handles API lifecycle.
- MSW provides realistic development API responses.
- Zustand controls graph interaction state.
- ReactFlow renders and updates the graph.
- The inspector, sidebar, topbar, and stack toolbar consume the same store-driven graph state.

That structure makes the dashboard feel interactive and production-like while remaining easy to explain in an interview.
