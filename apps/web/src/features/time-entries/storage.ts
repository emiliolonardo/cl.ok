import {
  MAX_TIME_ENTRIES,
  TIMER_STORAGE_KEY,
  type TimeEntry,
  type TimerDraft,
  type TimerState,
  type TimerStatus
} from "@/features/time-entries/types";

interface ParsedState {
  draft?: unknown;
  status?: unknown;
  elapsedMs?: unknown;
  startedAtMs?: unknown;
  sessionStartedAtMs?: unknown;
  entries?: unknown;
}

export function createInitialTimerState(): TimerState {
  return {
    draft: {
      project: "",
      task: "",
      note: ""
    },
    status: "idle",
    elapsedMs: 0,
    startedAtMs: null,
    sessionStartedAtMs: null,
    entries: []
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNonNegativeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

function toNullableTimestamp(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function toStatus(value: unknown): TimerStatus {
  return value === "running" || value === "paused" || value === "idle" ? value : "idle";
}

function toEntry(value: unknown): TimeEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toText(value.id);
  const startedAtISO = toText(value.startedAtISO);
  const endedAtISO = toText(value.endedAtISO);
  const durationMs = toNonNegativeNumber(value.durationMs);

  if (!id || !startedAtISO || !endedAtISO || durationMs <= 0) {
    return null;
  }

  return {
    id,
    project: toText(value.project),
    task: toText(value.task),
    note: toText(value.note),
    startedAtISO,
    endedAtISO,
    durationMs
  };
}

export function readTimerStateFromStorage(): TimerState {
  const initialState = createInitialTimerState();

  if (typeof window === "undefined") {
    return initialState;
  }

  const raw = window.localStorage.getItem(TIMER_STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as ParsedState;

    const draftSource = isRecord(parsed.draft) ? parsed.draft : {};
    const parsedDraft: TimerDraft = {
      project: toText(draftSource.project),
      task: toText(draftSource.task),
      note: toText(draftSource.note)
    };

    const parsedEntries = Array.isArray(parsed.entries)
      ? parsed.entries.map(toEntry).filter((entry): entry is TimeEntry => entry !== null).slice(0, MAX_TIME_ENTRIES)
      : [];

    return {
      draft: parsedDraft,
      status: toStatus(parsed.status),
      elapsedMs: toNonNegativeNumber(parsed.elapsedMs),
      startedAtMs: toNullableTimestamp(parsed.startedAtMs),
      sessionStartedAtMs: toNullableTimestamp(parsed.sessionStartedAtMs),
      entries: parsedEntries
    };
  } catch {
    return initialState;
  }
}

export function writeTimerStateToStorage(state: TimerState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
}
