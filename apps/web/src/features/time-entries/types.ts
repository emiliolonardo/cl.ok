export const TIMER_STORAGE_KEY = "dos-live-timer-v1";
export const MAX_TIME_ENTRIES = 50;

export type TimerStatus = "idle" | "running" | "paused";

export interface TimerDraft {
  projectId: string;
  taskId: string;
  project: string;
  task: string;
  note: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  taskId: string;
  project: string;
  task: string;
  note: string;
  startedAtISO: string;
  endedAtISO: string;
  durationMs: number;
}

export interface TimerState {
  draft: TimerDraft;
  status: TimerStatus;
  elapsedMs: number;
  startedAtMs: number | null;
  sessionStartedAtMs: number | null;
  entries: TimeEntry[];
}
