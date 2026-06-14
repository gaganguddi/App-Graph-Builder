import { http, HttpResponse, delay } from "msw";

import { cloneGraph, mockApps, mockGraphs } from "./mock-api";

export const handlers = [
  http.get("/api/apps", async () => {
    console.log("[MSW] /api/apps called");
    await delay(420);

    return HttpResponse.json({ apps: mockApps });
  }),

  http.get("/api/apps/:appId/graph", async ({ params }) => {
    console.log("[MSW] graph API called");
    await delay(520);

    const appId = String(params.appId);
    const graph = mockGraphs[appId];

    if (!graph) {
      return HttpResponse.json(
        { message: "Application graph was not found." },
        { status: 404 },
      );
    }

    return HttpResponse.json(cloneGraph(graph));
  }),
];
