"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { useProjectCatalog } from "@/features/project-catalog/use-project-catalog";

export default function Page() {
  const {
    projects,
    tasks,
    clientsById,
    projectsById,
    isHydrated,
    addTask,
    removeTask
  } = useProjectCatalog();

  const [projectId, setProjectId] = useState("");
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0].id);
      return;
    }

    const projectStillExists = projects.some((project) => project.id === projectId);
    if (!projectStillExists) {
      setProjectId(projects[0]?.id ?? "");
    }
  }, [projectId, projects]);

  const handleCreateTask = () => {
    const createdTask = addTask({
      projectId,
      name: taskName
    });

    if (!createdTask) {
      return;
    }

    setTaskName("");
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Tasks</p>
        <h1 className="text-2xl font-semibold text-dos-fg">Catalogo Task</h1>
        <p className="text-sm text-dos-fg/70">Definisci task per progetto da usare nel modulo Live Timer.</p>
      </header>

      {!isHydrated ? <p className="text-sm text-dos-fg/70">Caricamento task in corso...</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Nuovo Task</CardTitle>
          <CardDescription>Associa task a un progetto attivo.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessun progetto disponibile. Crea prima almeno un progetto.</p>
          ) : (
            <>
              <Select label="Progetto" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Nome Task"
                placeholder="Es. Planning Sprint"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
              />

              <Button onClick={handleCreateTask}>Crea task</Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Salvati</CardTitle>
          <CardDescription>Panoramica task per progetto e cliente.</CardDescription>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessun task creato.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Progetto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const project = projectsById.get(task.projectId);
                  const projectName = project?.name ?? "Progetto rimosso";
                  const clientName = project ? (clientsById.get(project.clientId)?.name ?? "Nessun cliente") : "-";

                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{projectName}</TableCell>
                      <TableCell>{clientName}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="danger" onClick={() => removeTask(task.id)}>
                          Elimina
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
