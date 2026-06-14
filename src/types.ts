import type { Edge, Node } from "reactflow";

export type AppSummary = {
  id: string;
  name: string;
  runtime: string;
  region: string;
};

export type ServiceStatus = "success" | "warning" | "error";

export type ServiceNodeData = {
  icon:
    | "postgres"
    | "redis"
    | "mongo"
    | "api"
    | "worker"
    | "github"
    | "docker"
    | "kubernetes";
  name: string;
  status: ServiceStatus;
  cpu: number;
  memory: number;
  disk: number;
  region: string;
  provider: "aws" | "gcp" | "azure";
  description: string;
  logs: string[];
};

export type ServiceNode = Node<ServiceNodeData, "serviceNode">;

export type GraphPayload = {
  nodes: ServiceNode[];
  edges: Edge[];
};
