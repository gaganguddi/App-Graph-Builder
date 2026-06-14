import { useEffect, useState } from "react";
import { Network } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

function App() {
  const theme = useAppStore((state) => state.theme);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Persist theme to localStorage
    localStorage.setItem("app-theme", theme);
    // Apply theme to document
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  // Load persisted theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as "dark" | "light" | null;
    if (savedTheme && savedTheme !== useAppStore.getState().theme) {
      useAppStore.setState({ theme: savedTheme });
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsSplashVisible(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`h-screen w-screen overflow-hidden transition-colors duration-300 ${
        theme === "light"
          ? "bg-slate-50 text-slate-900"
          : "bg-[#020617] text-white"
      }`}
    >
      {isSplashVisible && <SplashScreen />}
      <TooltipProvider>
        <div
          className={cn(
            "h-full w-full transition duration-700",
            isSplashVisible
              ? "scale-[0.992] opacity-0"
              : "scale-100 opacity-100",
          )}
        >
          <AppLayout />
        </div>
      </TooltipProvider>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="app-splash fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.2),transparent_26%),radial-gradient(circle_at_28%_68%,rgba(99,102,241,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#05070d_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(148,163,184,0.32)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl app-splash-glow" />

      <div className="relative z-10 flex flex-col items-center app-splash-card">
        <div className="relative mb-6 grid size-20 place-items-center rounded-2xl border border-white/12 bg-white/[0.045] shadow-[0_0_42px_rgba(56,189,248,0.22)] backdrop-blur-xl">
          <Network className="size-9 text-cyan-300 drop-shadow-[0_0_18px_rgba(103,232,249,0.7)]" />
          <span className="absolute -inset-3 -z-10 rounded-3xl bg-cyan-400/12 blur-2xl" />
        </div>

        <p className="text-2xl font-semibold tracking-normal">App Graph Builder</p>
        <p className="mt-2 text-sm text-white/48">Preparing infrastructure graph</p>

        <div className="mt-7 h-1 w-48 overflow-hidden rounded-full bg-white/10 shadow-[0_0_24px_rgba(56,189,248,0.12)]">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 app-splash-progress" />
        </div>
      </div>
    </div>
  );
}

export default App;
