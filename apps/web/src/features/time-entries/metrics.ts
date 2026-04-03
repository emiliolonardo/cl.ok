import type { TimeEntry } from "@/features/time-entries/types";

interface Range {
  startMs: number;
  endMs: number;
}

export function formatDuration(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function formatDurationCompact(durationMs: number): string {
  const totalMinutes = Math.max(0, Math.floor(durationMs / 60000));
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function formatDateTime(timestampISO: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestampISO));
}

function getDayRange(referenceMs: number): Range {
  const start = new Date(referenceMs);
  start.setHours(0, 0, 0, 0);

  return {
    startMs: start.getTime(),
    endMs: start.getTime() + 24 * 60 * 60 * 1000
  };
}

function getWeekRange(referenceMs: number): Range {
  const start = new Date(referenceMs);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);

  return {
    startMs: start.getTime(),
    endMs: start.getTime() + 7 * 24 * 60 * 60 * 1000
  };
}

function sumEntriesByRange(entries: TimeEntry[], range: Range): number {
  return entries.reduce((total, entry) => {
    const endedAtMs = new Date(entry.endedAtISO).getTime();
    const isInRange = endedAtMs >= range.startMs && endedAtMs < range.endMs;
    return isInRange ? total + entry.durationMs : total;
  }, 0);
}

function countProjectsByRange(entries: TimeEntry[], range: Range): number {
  const projects = new Set<string>();

  entries.forEach((entry) => {
    const endedAtMs = new Date(entry.endedAtISO).getTime();
    const isInRange = endedAtMs >= range.startMs && endedAtMs < range.endMs;
    if (!isInRange) {
      return;
    }

    const projectName = entry.project.trim() || "General";
    projects.add(projectName.toLocaleLowerCase());
  });

  return projects.size;
}

function listProjectsByRange(entries: TimeEntry[], range: Range): string[] {
  const projects = new Set<string>();

  entries.forEach((entry) => {
    const endedAtMs = new Date(entry.endedAtISO).getTime();
    const isInRange = endedAtMs >= range.startMs && endedAtMs < range.endMs;
    if (!isInRange) {
      return;
    }

    const projectName = entry.project.trim() || "General";
    projects.add(projectName.toLocaleLowerCase());
  });

  return Array.from(projects);
}

export function getTodayEntriesDurationMs(entries: TimeEntry[], nowMs = Date.now()): number {
  return sumEntriesByRange(entries, getDayRange(nowMs));
}

export function getYesterdayEntriesDurationMs(entries: TimeEntry[], nowMs = Date.now()): number {
  const yesterdayRange = getDayRange(nowMs - 24 * 60 * 60 * 1000);
  return sumEntriesByRange(entries, yesterdayRange);
}

export function getCurrentWeekEntriesDurationMs(entries: TimeEntry[], nowMs = Date.now()): number {
  return sumEntriesByRange(entries, getWeekRange(nowMs));
}

export function getPreviousWeekEntriesDurationMs(entries: TimeEntry[], nowMs = Date.now()): number {
  const currentWeek = getWeekRange(nowMs);
  const previousWeek: Range = {
    startMs: currentWeek.startMs - 7 * 24 * 60 * 60 * 1000,
    endMs: currentWeek.startMs
  };

  return sumEntriesByRange(entries, previousWeek);
}

export function getCurrentWeekProjectCount(entries: TimeEntry[], nowMs = Date.now()): number {
  return countProjectsByRange(entries, getWeekRange(nowMs));
}

export function getPreviousWeekProjectCount(entries: TimeEntry[], nowMs = Date.now()): number {
  const currentWeek = getWeekRange(nowMs);
  const previousWeek: Range = {
    startMs: currentWeek.startMs - 7 * 24 * 60 * 60 * 1000,
    endMs: currentWeek.startMs
  };

  return countProjectsByRange(entries, previousWeek);
}

export function getCurrentWeekProjectNames(entries: TimeEntry[], nowMs = Date.now()): string[] {
  return listProjectsByRange(entries, getWeekRange(nowMs));
}

export function getPreviousWeekProjectNames(entries: TimeEntry[], nowMs = Date.now()): string[] {
  const currentWeek = getWeekRange(nowMs);
  const previousWeek: Range = {
    startMs: currentWeek.startMs - 7 * 24 * 60 * 60 * 1000,
    endMs: currentWeek.startMs
  };

  return listProjectsByRange(entries, previousWeek);
}
