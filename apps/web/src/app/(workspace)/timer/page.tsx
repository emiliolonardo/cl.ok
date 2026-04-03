"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { formatDuration, type TimerStatus, useLiveTimer } from "@/features/live-timer/use-live-timer";
import { formatDateTime } from "@/features/time-entries/metrics";

const statusStyles: Record<TimerStatus, string> = {
  idle: "bg-dos-panel text-dos-fg",
  running: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700"
};

const statusLabels: Record<TimerStatus, string> = {
  idle: "Pronto",
  running: "In tracking",
  paused: "In pausa"
};

export default function Page() {
  const {
    draft,
    status,
    entries,
    elapsedMs,
    trackedTodayMs,
    updateDraftField,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    resetTimer,
    removeEntry,
    clearEntries
  } = useLiveTimer();

  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Live Timer</p>
        <h1 className="text-2xl font-semibold text-dos-fg">Time Tracker</h1>
        <p className="text-sm text-dos-fg/70">
          Traccia il tempo in tempo reale e salva automaticamente le entry nello storico.
        </p>
      </header>

      <Card className="space-y-4">
        <CardHeader className="mb-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Sessione Corrente</CardTitle>
            <span className={`rounded-dos px-2 py-1 text-xs font-medium ${statusStyles[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <CardDescription>Compila progetto e task, poi avvia il timer.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Progetto"
              placeholder="Es. System Prototype"
              value={draft.project}
              onChange={(event) => updateDraftField("project", event.target.value)}
            />
            <Input
              label="Task"
              placeholder="Es. Interface Mapping"
              value={draft.task}
              onChange={(event) => updateDraftField("task", event.target.value)}
            />
          </div>

          <Input
            label="Nota (opzionale)"
            placeholder="Aggiungi contesto rapido per questa sessione"
            value={draft.note}
            onChange={(event) => updateDraftField("note", event.target.value)}
          />

          <div className="rounded-dos border border-dos-line bg-dos-panel p-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Tempo live</p>
            <p className="mt-2 text-5xl font-semibold tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
              {formatDuration(elapsedMs)}
            </p>
            <p className="mt-2 text-xs text-dos-fg/70">Totale tracciato oggi: {formatDuration(trackedTodayMs)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isIdle ? <Button onClick={startTimer}>Avvia</Button> : null}
            {isRunning ? (
              <Button variant="secondary" onClick={pauseTimer}>
                Pausa
              </Button>
            ) : null}
            {isPaused ? (
              <Button variant="secondary" onClick={resumeTimer}>
                Riprendi
              </Button>
            ) : null}
            {!isIdle ? (
              <Button onClick={stopAndSaveTimer} className="bg-[#00C781] border-[#00C781] hover:brightness-110">
                Stop & Salva
              </Button>
            ) : null}
            {!isIdle || elapsedMs > 0 ? (
              <Button variant="ghost" onClick={resetTimer}>
                Reset sessione
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Storico Entry</CardTitle>
              <CardDescription>Le ultime sessioni salvate sul browser locale.</CardDescription>
            </div>
            {entries.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearEntries}>
                Svuota storico
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessuna entry ancora. Avvia il timer e salva la prima sessione.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Progetto</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Durata</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <p className="font-medium text-dos-fg">{entry.project}</p>
                      {entry.note ? <p className="text-xs text-dos-fg/60">{entry.note}</p> : null}
                    </TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell className="font-medium">{formatDuration(entry.durationMs)}</TableCell>
                    <TableCell>{formatDateTime(entry.endedAtISO)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="danger" onClick={() => removeEntry(entry.id)}>
                        Elimina
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
