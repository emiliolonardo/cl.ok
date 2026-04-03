"use client";

import {
  MAX_TIME_ENTRIES,
  type TimerDraft,
  type TimerState,
  type TimerStatus,
  type TimeEntry
} from "@/features/time-entries/types";
import {
  createInitialTimerState,
  readTimerStateFromStorage,
  writeTimerStateToStorage
} from "@/features/time-entries/storage";
import { formatDuration } from "@/features/time-entries/metrics";
import { useCallback, useEffect, useMemo, useState } from "react";

export type { TimerDraft, TimerState, TimerStatus, TimeEntry };
export { formatDuration };

function createEntryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}`;
}

function computeElapsedMs(state: TimerState, nowMs: number): number {
  if (state.status !== "running" || state.startedAtMs === null) {
    return state.elapsedMs;
  }

  return state.elapsedMs + Math.max(0, nowMs - state.startedAtMs);
}

export function useLiveTimer() {
  const [state, setState] = useState<TimerState>(createInitialTimerState);
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const persistedState = readTimerStateFromStorage();
    setState(persistedState);
    setNowMs(Date.now());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeTimerStateToStorage(state);
  }, [state, isHydrated]);

  useEffect(() => {
    if (state.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [state.status]);

  const elapsedMs = useMemo(() => computeElapsedMs(state, nowMs), [nowMs, state]);

  const updateDraftField = useCallback((field: keyof TimerDraft, value: string) => {
    setState((previous) => ({
      ...previous,
      draft: {
        ...previous.draft,
        [field]: value
      }
    }));
  }, []);

  const startTimer = useCallback(() => {
    const now = Date.now();

    setState((previous) => {
      if (previous.status === "running") {
        return previous;
      }

      if (previous.status === "paused") {
        return {
          ...previous,
          status: "running",
          startedAtMs: now,
          sessionStartedAtMs: previous.sessionStartedAtMs ?? now
        };
      }

      return {
        ...previous,
        status: "running",
        elapsedMs: 0,
        startedAtMs: now,
        sessionStartedAtMs: now
      };
    });
  }, []);

  const pauseTimer = useCallback(() => {
    const now = Date.now();

    setState((previous) => {
      if (previous.status !== "running" || previous.startedAtMs === null) {
        return previous;
      }

      return {
        ...previous,
        status: "paused",
        elapsedMs: previous.elapsedMs + Math.max(0, now - previous.startedAtMs),
        startedAtMs: null
      };
    });
  }, []);

  const resumeTimer = useCallback(() => {
    const now = Date.now();

    setState((previous) => {
      if (previous.status !== "paused") {
        return previous;
      }

      return {
        ...previous,
        status: "running",
        startedAtMs: now,
        sessionStartedAtMs: previous.sessionStartedAtMs ?? now
      };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setState((previous) => ({
      ...previous,
      status: "idle",
      elapsedMs: 0,
      startedAtMs: null,
      sessionStartedAtMs: null
    }));
  }, []);

  const stopAndSaveTimer = useCallback(() => {
    const now = Date.now();

    setState((previous) => {
      if (previous.status === "idle") {
        return previous;
      }

      const finalDurationMs =
        previous.status === "running" && previous.startedAtMs !== null
          ? previous.elapsedMs + Math.max(0, now - previous.startedAtMs)
          : previous.elapsedMs;

      const resetState: TimerState = {
        ...previous,
        status: "idle",
        elapsedMs: 0,
        startedAtMs: null,
        sessionStartedAtMs: null
      };

      if (finalDurationMs <= 0) {
        return resetState;
      }

      const entry: TimeEntry = {
        id: createEntryId(),
        projectId: previous.draft.projectId.trim(),
        taskId: previous.draft.taskId.trim(),
        project: previous.draft.project.trim() || "General",
        task: previous.draft.task.trim() || "Untitled task",
        note: previous.draft.note.trim(),
        startedAtISO: new Date((previous.sessionStartedAtMs ?? now) - finalDurationMs).toISOString(),
        endedAtISO: new Date(now).toISOString(),
        durationMs: finalDurationMs
      };

      return {
        ...resetState,
        entries: [entry, ...previous.entries].slice(0, MAX_TIME_ENTRIES)
      };
    });
  }, []);

  const removeEntry = useCallback((entryId: string) => {
    setState((previous) => ({
      ...previous,
      entries: previous.entries.filter((entry) => entry.id !== entryId)
    }));
  }, []);

  const clearEntries = useCallback(() => {
    setState((previous) => ({
      ...previous,
      entries: []
    }));
  }, []);

  const trackedTodayMs = useMemo(() => {
    const today = new Date(nowMs).toDateString();

    const entryMs = state.entries.reduce((total, entry) => {
      const sameDay = new Date(entry.endedAtISO).toDateString() === today;
      return sameDay ? total + entry.durationMs : total;
    }, 0);

    const activeMs = state.status === "idle" ? 0 : elapsedMs;
    return entryMs + activeMs;
  }, [elapsedMs, nowMs, state.entries, state.status]);

  return {
    draft: state.draft,
    status: state.status,
    entries: state.entries,
    elapsedMs,
    trackedTodayMs,
    isHydrated,
    updateDraftField,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    resetTimer,
    removeEntry,
    clearEntries
  };
}
