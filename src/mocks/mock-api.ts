import type { AppSummary, GraphPayload, ServiceNode } from "@/types";

export const mockApps: AppSummary[] = [
  {
    id: "supertokens-platform",
    name: "supertokens-platform",
    runtime: "Production",
    region: "us-east-1",
  },
  {
    id: "supertokens-java",
    name: "supertokens-java",
    runtime: "Staging",
    region: "eu-west-1",
  },
  {
    id: "supertokens-python",
    name: "supertokens-python",
    runtime: "Preview",
    region: "ap-south-1",
  },
  {
    id: "supertokens-ruby",
    name: "supertokens-ruby",
    runtime: "Staging",
    region: "us-west-2",
  },
  {
    id: "supertokens-go",
    name: "supertokens-go",
    runtime: "Production",
    region: "us-east-2",
  },
];

const node = (
  id: string,
  position: ServiceNode["position"],
  data: ServiceNode["data"],
): ServiceNode => ({
  id,
  type: "serviceNode",
  position,
  data,
});

export const mockGraphs: Record<string, GraphPayload> = {
  "supertokens-platform": {
    nodes: [
      node("postgres", { x: 460, y: 0 }, {
        icon: "postgres",
        name: "Postgres",
        status: "success",
        cpu: 0.02,
        memory: 0.05,
        disk: 10,
        region: "us-east-1",
        provider: "aws",
        description: "Primary relational datastore for tenant metadata and sessions.",
        logs: ["09:42 health check passed", "09:43 replica lag 12ms", "09:44 vacuum completed"],
      }),
      node("redis", { x: 20, y: 460 }, {
        icon: "redis",
        name: "Redis",
        status: "error",
        cpu: 0.02,
        memory: 0.05,
        disk: 10,
        region: "us-east-1",
        provider: "aws",
        description: "Session cache and rate-limit coordination layer.",
        logs: ["09:39 reconnect attempt failed", "09:40 connection refused", "09:42 alert dispatched"],
      }),
      node("mongo", { x: 900, y: 460 }, {
        icon: "mongo",
        name: "MongoDB",
        status: "success",
        cpu: 0.02,
        memory: 0.05,
        disk: 10,
        region: "us-east-1",
        provider: "aws",
        description: "Document store for analytics snapshots and event trails.",
        logs: ["09:31 shard balanced", "09:41 oplog window healthy", "09:45 query cache warmed"],
      }),
      node("api", { x: 460, y: 230 }, {
        icon: "api",
        name: "Auth API",
        status: "success",
        cpu: 0.13,
        memory: 0.44,
        disk: 4,
        region: "us-east-1",
        provider: "aws",
        description: "Public authentication API serving customer traffic.",
        logs: ["09:32 deploy complete", "09:37 p95 latency 82ms", "09:46 autoscale stable"],
      }),
    ],
    edges: [
      { id: "api-postgres", source: "api", target: "postgres", animated: true, type: "smoothstep" },
      { id: "api-redis", source: "api", target: "redis", animated: true, type: "smoothstep" },
      { id: "api-mongo", source: "api", target: "mongo", animated: true, type: "smoothstep" },
    ],
  },
  "supertokens-java": {
    nodes: [
      node("java-api", { x: 220, y: 120 }, {
        icon: "api",
        name: "Java API",
        status: "success",
        cpu: 0.18,
        memory: 0.62,
        disk: 8,
        region: "eu-west-1",
        provider: "gcp",
        description: "Staging auth service for JVM integration tests.",
        logs: ["12:10 boot complete", "12:12 smoke tests passed", "12:14 query cache warmed"],
      }),
      node("java-postgres", { x: 780, y: 120 }, {
        icon: "postgres",
        name: "Staging Postgres",
        status: "warning",
        cpu: 0.08,
        memory: 0.2,
        disk: 12,
        region: "eu-west-1",
        provider: "gcp",
        description: "Staging database with synthetic traffic fixtures.",
        logs: ["12:03 storage at 72%", "12:11 backup scheduled", "12:19 slow query detected"],
      }),
      node("java-worker", { x: 500, y: 440 }, {
        icon: "worker",
        name: "Sync Worker",
        status: "success",
        cpu: 0.07,
        memory: 0.18,
        disk: 3,
        region: "eu-west-1",
        provider: "gcp",
        description: "Background worker for webhook retries and sync jobs.",
        logs: ["12:04 queue depth 14", "12:15 retry batch complete", "12:23 idle"],
      }),
    ],
    edges: [
      { id: "java-api-db", source: "java-api", target: "java-postgres", animated: true, type: "smoothstep" },
      { id: "java-api-worker", source: "java-api", target: "java-worker", animated: true, type: "smoothstep" },
    ],
  },
  "supertokens-python": {
    nodes: [
      node("py-api", { x: 220, y: 120 }, {
        icon: "api",
        name: "Python API",
        status: "success",
        cpu: 0.12,
        memory: 0.39,
        disk: 6,
        region: "ap-south-1",
        provider: "azure",
        description: "Regional auth API for Python SDK validation.",
        logs: ["18:03 warmed", "18:08 p95 latency 105ms", "18:16 probe passed"],
      }),
      node("py-redis", { x: 780, y: 120 }, {
        icon: "redis",
        name: "Regional Redis",
        status: "success",
        cpu: 0.03,
        memory: 0.09,
        disk: 5,
        region: "ap-south-1",
        provider: "azure",
        description: "Ephemeral cache for token exchange flows.",
        logs: ["18:00 persistence synced", "18:09 memory stable", "18:14 hit rate 93%"],
      }),
      node("py-mongo", { x: 500, y: 440 }, {
        icon: "mongo",
        name: "Telemetry Mongo",
        status: "warning",
        cpu: 0.05,
        memory: 0.24,
        disk: 14,
        region: "ap-south-1",
        provider: "azure",
        description: "Telemetry sink for regional integration runs.",
        logs: ["18:02 index build pending", "18:07 write queue 21", "18:13 compaction started"],
      }),
    ],
    edges: [
      { id: "py-api-redis", source: "py-api", target: "py-redis", animated: true, type: "smoothstep" },
      { id: "py-api-mongo", source: "py-api", target: "py-mongo", animated: true, type: "smoothstep" },
    ],
  },
  "supertokens-ruby": {
    nodes: [
      node("ruby-api", { x: 220, y: 120 }, {
        icon: "api",
        name: "Ruby API",
        status: "success",
        cpu: 0.16,
        memory: 0.48,
        disk: 7,
        region: "us-west-2",
        provider: "aws",
        description: "Rails authentication API serving staging customer flows.",
        logs: ["14:04 puma workers online", "14:08 route cache warmed", "14:15 health check passed"],
      }),
      node("ruby-sidekiq", { x: 500, y: 440 }, {
        icon: "worker",
        name: "Sidekiq Worker",
        status: "warning",
        cpu: 0.09,
        memory: 0.34,
        disk: 5,
        region: "us-west-2",
        provider: "aws",
        description: "Background job worker for webhooks, retries, and sync tasks.",
        logs: ["14:02 queue latency 1.4s", "14:12 retry set drained", "14:21 concurrency adjusted"],
      }),
      node("ruby-postgres", { x: 780, y: 120 }, {
        icon: "postgres",
        name: "Ruby PostgreSQL",
        status: "success",
        cpu: 0.05,
        memory: 0.22,
        disk: 18,
        region: "us-west-2",
        provider: "aws",
        description: "Primary relational store for Rails tenants and sessions.",
        logs: ["14:01 backup complete", "14:09 query plan cached", "14:18 replica lag 18ms"],
      }),
    ],
    edges: [
      { id: "ruby-api-postgres", source: "ruby-api", target: "ruby-postgres", animated: true, type: "smoothstep" },
      { id: "ruby-api-sidekiq", source: "ruby-api", target: "ruby-sidekiq", animated: true, type: "smoothstep" },
    ],
  },
  "supertokens-go": {
    nodes: [
      node("go-api", { x: 220, y: 120 }, {
        icon: "api",
        name: "Go API",
        status: "success",
        cpu: 0.14,
        memory: 0.38,
        disk: 6,
        region: "us-east-2",
        provider: "aws",
        description: "Low-latency Go authentication API for production traffic.",
        logs: ["16:31 binary rolled out", "16:34 p95 latency 54ms", "16:38 autoscale stable"],
      }),
      node("go-redis", { x: 500, y: 440 }, {
        icon: "redis",
        name: "Go Redis",
        status: "success",
        cpu: 0.03,
        memory: 0.12,
        disk: 5,
        region: "us-east-2",
        provider: "aws",
        description: "Session cache and rate-limit coordinator for Go services.",
        logs: ["16:22 hit rate 96%", "16:29 memory stable", "16:36 persistence synced"],
      }),
      node("go-postgres", { x: 780, y: 120 }, {
        icon: "postgres",
        name: "Go PostgreSQL",
        status: "success",
        cpu: 0.04,
        memory: 0.2,
        disk: 16,
        region: "us-east-2",
        provider: "aws",
        description: "Production relational datastore for identities and app metadata.",
        logs: ["16:24 vacuum complete", "16:32 connection pool stable", "16:40 backup scheduled"],
      }),
    ],
    edges: [
      { id: "go-api-redis", source: "go-api", target: "go-redis", animated: true, type: "smoothstep" },
      { id: "go-api-postgres", source: "go-api", target: "go-postgres", animated: true, type: "smoothstep" },
    ],
  },
};

export const cloneGraph = (graph: GraphPayload): GraphPayload => ({
  nodes: graph.nodes.map((graphNode) => ({ ...graphNode, data: { ...graphNode.data, logs: [...graphNode.data.logs] } })),
  edges: graph.edges.map((edge) => ({ ...edge })),
});

export async function getApps(): Promise<{ apps: AppSummary[] }> {
  const response = await fetch("/api/apps");

  if (!response.ok) {
    throw new Error("Unable to load applications.");
  }

  return response.json() as Promise<{ apps: AppSummary[] }>;
}

export async function getAppGraph(appId: string): Promise<GraphPayload> {
  const response = await fetch(`/api/apps/${appId}/graph`);

  if (!response.ok) {
    throw new Error("Application graph was not found.");
  }

  return response.json() as Promise<GraphPayload>;
}
