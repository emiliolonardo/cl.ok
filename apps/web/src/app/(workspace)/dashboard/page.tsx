"use client";

import { useMemo } from "react";
import { useLiveTimer } from "@/features/live-timer/use-live-timer";
import {
  formatDurationCompact,
  formatDateTime,
  getCurrentWeekEntriesDurationMs,
  getCurrentWeekProjectNames,
  getPreviousWeekEntriesDurationMs,
  getPreviousWeekProjectNames,
  getTodayEntriesDurationMs,
  getYesterdayEntriesDurationMs
} from "@/features/time-entries/metrics";
import type { TimerStatus, TimeEntry } from "@/features/time-entries/types";

type Trend = "up" | "down" | "flat";
type ActivityState = "running" | "completed" | "paused";

interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: Trend;
}

interface ActivityRow {
  id: string;
  project: string;
  task: string;
  startedAt: string;
  duration: string;
  state: ActivityState;
}

const trendStyles: Record<Trend, string> = {
  up: "text-emerald-700 bg-emerald-100",
  down: "text-rose-700 bg-rose-100",
  flat: "text-blue-700 bg-blue-100"
};

const trendLabels: Record<Trend, string> = {
  up: "In crescita",
  down: "In calo",
  flat: "Stabile"
};

const stateStyles: Record<ActivityState, string> = {
  running: "bg-dos-accent/30 text-dos-fg",
  completed: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700"
};

const stateLabels: Record<ActivityState, string> = {
  running: "In corso",
  completed: "Completata",
  paused: "In pausa"
};

function getTrend(current: number, previous: number): Trend {
  if (current > previous) {
    return "up";
  }

  if (current < previous) {
    return "down";
  }

  return "flat";
}

function formatDeltaLabel(current: number, previous: number, baselineLabel: string): string {
  const delta = current - previous;

  if (delta === 0) {
    return `In linea con ${baselineLabel}`;
  }

  const signedDelta = `${delta > 0 ? "+" : "-"}${formatDurationCompact(Math.abs(delta))}`;
  return `${signedDelta} rispetto a ${baselineLabel}`;
}

function formatProjectDeltaLabel(current: number, previous: number): string {
  const delta = current - previous;

  if (delta === 0) {
    return "In linea con la scorsa settimana";
  }

  return `${delta > 0 ? "+" : "-"}${Math.abs(delta)} rispetto alla scorsa settimana`;
}

function buildActivities(
  entries: TimeEntry[],
  status: TimerStatus,
  elapsedMs: number,
  draftProject: string,
  draftTask: string
): ActivityRow[] {
  const savedActivities: ActivityRow[] = entries.slice(0, 6).map((entry) => ({
    id: entry.id,
    project: entry.project,
    task: entry.task,
    startedAt: formatDateTime(entry.startedAtISO),
    duration: formatDurationCompact(entry.durationMs),
    state: "completed"
  }));

  if (status === "idle") {
    return savedActivities;
  }

  const liveActivity: ActivityRow = {
    id: "live-session",
    project: draftProject.trim() || "General",
    task: draftTask.trim() || "Sessione in corso",
    startedAt: "Sessione attiva",
    duration: formatDurationCompact(elapsedMs),
    state: status === "running" ? "running" : "paused"
  };

  return [liveActivity, ...savedActivities].slice(0, 6);
}

export default function Page() {
  const { draft, status, entries, elapsedMs, isHydrated } = useLiveTimer();

  const { kpis, activities } = useMemo(() => {
    const nowMs = Date.now();
    const activeSessionMs = status === "idle" ? 0 : elapsedMs;

    const todayEntriesMs = getTodayEntriesDurationMs(entries, nowMs);
    const yesterdayEntriesMs = getYesterdayEntriesDurationMs(entries, nowMs);
    const weekEntriesMs = getCurrentWeekEntriesDurationMs(entries, nowMs);
    const previousWeekEntriesMs = getPreviousWeekEntriesDurationMs(entries, nowMs);

    const todayTotalMs = todayEntriesMs + activeSessionMs;
    const weekTotalMs = weekEntriesMs + activeSessionMs;

    const currentWeekProjects = new Set(getCurrentWeekProjectNames(entries, nowMs));
    if (status !== "idle") {
      const activeProject = (draft.project.trim() || "General").toLocaleLowerCase();
      currentWeekProjects.add(activeProject);
    }

    const previousWeekProjects = new Set(getPreviousWeekProjectNames(entries, nowMs));

    const dashboardKpis: DashboardKpi[] = [
      {
        id: "hours-today",
        label: "Ore oggi",
        value: formatDurationCompact(todayTotalMs),
        detail: formatDeltaLabel(todayTotalMs, yesterdayEntriesMs, "ieri"),
        trend: getTrend(todayTotalMs, yesterdayEntriesMs)
      },
      {
        id: "hours-week",
        label: "Settimana",
        value: formatDurationCompact(weekTotalMs),
        detail: formatDeltaLabel(weekTotalMs, previousWeekEntriesMs, "la scorsa settimana"),
        trend: getTrend(weekTotalMs, previousWeekEntriesMs)
      },
      {
        id: "active-projects",
        label: "Progetti attivi",
        value: currentWeekProjects.size.toString().padStart(2, "0"),
        detail: formatProjectDeltaLabel(currentWeekProjects.size, previousWeekProjects.size),
        trend: getTrend(currentWeekProjects.size, previousWeekProjects.size)
      }
    ];

    return {
      kpis: dashboardKpis,
      activities: buildActivities(entries, status, elapsedMs, draft.project, draft.task)
    };
  }, [draft.project, draft.task, elapsedMs, entries, status]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Dashboard</p>
        <h1 className="text-2xl font-semibold text-dos-fg">Panoramica Operativa</h1>
        <p className="text-sm text-dos-fg/70">
          Snapshot rapido di avanzamento, carico orario e attività più recenti.
        </p>
      </header>

      {!isHydrated ? <p className="text-sm text-dos-fg/70">Caricamento dati locali in corso...</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <article
            key={kpi.id}
            className="rounded-dos border border-dos-line bg-dos-panel p-4 shadow-dos-sm"
          >
            <p className="text-xs uppercase tracking-[0.1em] text-dos-primary">{kpi.label}</p>
            <p className="mt-3 text-3xl font-semibold text-dos-fg">{kpi.value}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs text-dos-fg/70">{kpi.detail}</p>
              <span className={`rounded-dos px-2 py-1 text-[11px] font-medium ${trendStyles[kpi.trend]}`}>
                {trendLabels[kpi.trend]}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-dos border border-dos-line bg-white shadow-dos-sm">
        <div className="border-b border-dos-line px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-dos-primary">
            Attività Recenti
          </h2>
        </div>

        {activities.length === 0 ? (
          <p className="px-4 py-6 text-sm text-dos-fg/70">Nessuna attività ancora. Avvia il timer per creare le prime entry.</p>
        ) : (
          <div className="divide-y divide-dos-line">
            {activities.map((activity) => (
              <article key={activity.id} className="grid gap-3 px-4 py-3 md:grid-cols-[1.2fr_1.1fr_auto]">
                <div>
                  <p className="text-sm font-medium text-dos-fg">{activity.project}</p>
                  <p className="text-xs text-dos-fg/70">{activity.task}</p>
                </div>

                <div className="text-xs text-dos-fg/70">
                  <p>Inizio: {activity.startedAt}</p>
                  <p>Durata: {activity.duration}</p>
                </div>

                <div className="md:text-right">
                  <span
                    className={`inline-block rounded-dos px-2 py-1 text-[11px] font-medium ${stateStyles[activity.state]}`}
                  >
                    {stateLabels[activity.state]}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
