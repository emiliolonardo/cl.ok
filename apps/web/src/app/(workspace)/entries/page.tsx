"use client";

import { useMemo, useState } from "react";
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
import { useLiveTimer } from "@/features/live-timer/use-live-timer";
import {
  formatDateTime,
  formatDuration,
  formatDurationCompact,
  getCurrentWeekEntriesDurationMs,
  getTodayEntriesDurationMs
} from "@/features/time-entries/metrics";

export default function Page() {
  const { entries, removeEntry, clearEntries, isHydrated } = useLiveTimer();
  const [query, setQuery] = useState("");

  const nowMs = Date.now();
  const todayTotalMs = getTodayEntriesDurationMs(entries, nowMs);
  const weekTotalMs = getCurrentWeekEntriesDurationMs(entries, nowMs);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) {
      return entries;
    }

    return entries.filter((entry) => {
      const searchable = `${entry.project} ${entry.task} ${entry.note}`.toLocaleLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [entries, query]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Time Entries</p>
        <h1 className="text-2xl font-semibold text-dos-fg">Registro Sessioni</h1>
        <p className="text-sm text-dos-fg/70">Revisione veloce delle sessioni salvate in locale dal live timer.</p>
      </header>

      {!isHydrated ? <p className="text-sm text-dos-fg/70">Caricamento entry locali in corso...</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-dos-panel">
          <CardHeader>
            <CardDescription>Totale Oggi</CardDescription>
            <CardTitle className="text-2xl">{formatDurationCompact(todayTotalMs)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-dos-panel">
          <CardHeader>
            <CardDescription>Totale Settimana</CardDescription>
            <CardTitle className="text-2xl">{formatDurationCompact(weekTotalMs)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-dos-panel">
          <CardHeader>
            <CardDescription>Sessioni Salvate</CardDescription>
            <CardTitle className="text-2xl">{entries.length.toString().padStart(2, "0")}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <CardTitle>Entry Salvate</CardTitle>
              <CardDescription>Filtra per progetto, task o note.</CardDescription>
            </div>
            {entries.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearEntries}>
                Svuota storico
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            label="Ricerca"
            placeholder="Es. Interface Mapping"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {entries.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessuna entry disponibile. Avvia e salva una sessione da Live Timer.</p>
          ) : filteredEntries.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessuna entry trovata per il filtro corrente.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Progetto</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Inizio</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Durata</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <p className="font-medium text-dos-fg">{entry.project}</p>
                      {entry.note ? <p className="text-xs text-dos-fg/60">{entry.note}</p> : null}
                    </TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell>{formatDateTime(entry.startedAtISO)}</TableCell>
                    <TableCell>{formatDateTime(entry.endedAtISO)}</TableCell>
                    <TableCell className="font-medium">{formatDuration(entry.durationMs)}</TableCell>
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
