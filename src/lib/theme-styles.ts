import type { ServiceStatus } from "@/types";

export const statusStyles: Record<"dark" | "light", Record<ServiceStatus, string>> = {
  dark: {
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    error: "border-red-500/40 bg-red-500/10 text-red-400",
  },
  light: {
    success: "border-emerald-500/35 bg-emerald-50 text-emerald-700",
    warning: "border-amber-500/35 bg-amber-50 text-amber-700",
    error: "border-red-500/35 bg-red-50 text-red-700",
  },
};

export function getStatusStyle(theme: "dark" | "light", status: ServiceStatus) {
  return statusStyles[theme][status];
}
