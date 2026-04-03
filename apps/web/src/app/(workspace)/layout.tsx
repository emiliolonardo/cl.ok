"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useLiveTimer } from "@/features/live-timer/use-live-timer";
import { formatDuration } from "@/features/time-entries/metrics";
import type { TimerStatus } from "@/features/time-entries/types";

const modules = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/timer", label: "Live Timer" },
  { href: "/entries", label: "Time Entries" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
  { href: "/analytics", label: "Analytics" },
  { href: "/reports", label: "Reports" },
  { href: "/abcde", label: "ABCoDE" },
  { href: "/mesh", label: "Mesh" },
  { href: "/prompt-ops", label: "Prompt Ops" }
];

const statusLabels: Record<TimerStatus, string> = {
  idle: "Pronto",
  running: "In tracking",
  paused: "In pausa"
};

const statusDotStyles: Record<TimerStatus, string> = {
  idle: "bg-dos-primary/40",
  running: "bg-[#00C781]",
  paused: "bg-[#FFB400]"
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { draft, status, elapsedMs, isHydrated } = useLiveTimer();
  const hasActiveSession = status !== "idle";
  const liveDuration = hasActiveSession ? formatDuration(elapsedMs) : "00:00:00";
  const projectLabel = draft.project.trim() || "General";
  const taskLabel = draft.task.trim() || "Sessione in corso";
  const noteLabel = draft.note.trim();

  return (
    <div className="min-h-screen bg-dos-bg text-dos-fg">
      <header className="h-14 border-b border-dos-line bg-white px-6 flex items-center justify-between">
        <div className="text-sm tracking-wide uppercase font-medium">D.O.S. Time OS</div>
        <div className="flex items-center gap-2 text-xs font-medium text-dos-primary">
          <span
            aria-hidden="true"
            className={`inline-block h-2 w-2 rounded-full ${statusDotStyles[status]} ${status === "running" ? "animate-pulse" : ""}`}
          />
          <span>
            {isHydrated ? `Live Session: ${liveDuration}` : "Live Session: --:--:--"}
          </span>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        <aside className="w-64 border-r border-dos-line bg-white p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">
            Modules
          </p>
          <nav className="space-y-1">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="block rounded-dos border border-transparent px-3 py-2 text-sm hover:border-dos-line hover:bg-dos-panel"
              >
                {module.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <section className="mb-6 border border-dos-line bg-white p-4 shadow-dos-sm">
            <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">
              Live Tracking Bar
            </p>
            {!isHydrated ? (
              <p className="mt-2 text-sm text-dos-fg/70">Caricamento stato sessione...</p>
            ) : hasActiveSession ? (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className={`inline-block h-2 w-2 rounded-full ${statusDotStyles[status]}`} />
                <span>Project: {projectLabel}</span>
                <span className="text-dos-primary">|</span>
                <span>Task: {taskLabel}</span>
                <span className="text-dos-primary">|</span>
                <span>Status: {statusLabels[status]}</span>
                <span className="text-dos-primary">|</span>
                <span>Elapsed: {liveDuration}</span>
                {noteLabel ? (
                  <>
                    <span className="text-dos-primary">|</span>
                    <span>Note: {noteLabel}</span>
                  </>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-dos-fg/70">
                Nessuna sessione attiva. Vai su Live Timer per avviare il tracking.
              </p>
            )}
          </section>

          <section className="border border-dos-line bg-white p-4 shadow-dos-sm">{children}</section>
        </main>
      </div>
    </div>
  );
}
