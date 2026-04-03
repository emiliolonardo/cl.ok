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
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { useProjectCatalog } from "@/features/project-catalog/use-project-catalog";

const NONE_CLIENT_VALUE = "__none__";
const NEW_CLIENT_VALUE = "__new__";

export default function Page() {
  const {
    clients,
    teamMembers,
    projects,
    tasks,
    clientsById,
    membersById,
    isHydrated,
    addClient,
    removeClient,
    addProject,
    removeProject
  } = useProjectCatalog();

  const [projectName, setProjectName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>(NONE_CLIENT_VALUE);
  const [newClientName, setNewClientName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [standaloneClientName, setStandaloneClientName] = useState("");

  const taskCountByProject = useMemo(() => {
    const map = new Map<string, number>();

    tasks.forEach((task) => {
      map.set(task.projectId, (map.get(task.projectId) ?? 0) + 1);
    });

    return map;
  }, [tasks]);

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((previous) => {
      if (previous.includes(memberId)) {
        return previous.filter((id) => id !== memberId);
      }

      return [...previous, memberId];
    });
  };

  const handleCreateStandaloneClient = () => {
    const createdClient = addClient(standaloneClientName);
    if (!createdClient) {
      return;
    }

    setStandaloneClientName("");
  };

  const handleCreateProject = () => {
    let clientId = "";

    if (selectedClientId === NEW_CLIENT_VALUE) {
      const createdClient = addClient(newClientName);
      if (!createdClient) {
        return;
      }

      clientId = createdClient.id;
    } else if (selectedClientId !== NONE_CLIENT_VALUE) {
      clientId = selectedClientId;
    }

    const project = addProject({
      name: projectName,
      clientId,
      memberIds: selectedMemberIds
    });

    if (!project) {
      return;
    }

    setProjectName("");
    setSelectedClientId(NONE_CLIENT_VALUE);
    setNewClientName("");
    setSelectedMemberIds([]);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Projects</p>
        <h1 className="text-2xl font-semibold text-dos-fg">Registro Progetti</h1>
        <p className="text-sm text-dos-fg/70">
          Crea nuovi progetti, collegali ai clienti e assegna i membri del team operativi.
        </p>
      </header>

      {!isHydrated ? <p className="text-sm text-dos-fg/70">Caricamento catalogo progetti in corso...</p> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nuovo Progetto</CardTitle>
            <CardDescription>
              Definisci anagrafica progetto, cliente di riferimento e membri assegnati.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Nome Progetto"
              placeholder="Es. Redesign Client Portal"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />

            <Select
              label="Cliente"
              value={selectedClientId}
              onChange={(event) => setSelectedClientId(event.target.value)}
            >
              <option value={NONE_CLIENT_VALUE}>Nessun cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
              <option value={NEW_CLIENT_VALUE}>+ Nuovo cliente</option>
            </Select>

            {selectedClientId === NEW_CLIENT_VALUE ? (
              <Input
                label="Nuovo Cliente"
                placeholder="Es. Acme Corporation"
                value={newClientName}
                onChange={(event) => setNewClientName(event.target.value)}
              />
            ) : null}

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.12em] text-dos-fg/80 font-medium">Team Assegnato</p>
              {teamMembers.length === 0 ? (
                <p className="text-sm text-dos-fg/70">Nessun membro disponibile. Crea prima il team nel modulo Team.</p>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {teamMembers.map((member) => {
                    const isSelected = selectedMemberIds.includes(member.id);
                    return (
                      <label
                        key={member.id}
                        className="flex items-center gap-2 rounded-dos border border-dos-line bg-dos-panel px-3 py-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMemberSelection(member.id)}
                        />
                        <span>{member.fullName}</span>
                        {member.role ? <span className="text-dos-fg/60">({member.role})</span> : null}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <Button onClick={handleCreateProject}>Crea progetto</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clienti</CardTitle>
            <CardDescription>Anagrafica clienti disponibile per i progetti.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Input
                className="min-w-[220px] flex-1"
                label="Nuovo Cliente"
                placeholder="Es. Stark Industries"
                value={standaloneClientName}
                onChange={(event) => setStandaloneClientName(event.target.value)}
              />
              <div className="pt-[27px]">
                <Button variant="secondary" onClick={handleCreateStandaloneClient}>
                  Aggiungi cliente
                </Button>
              </div>
            </div>

            {clients.length === 0 ? (
              <p className="text-sm text-dos-fg/70">Nessun cliente creato.</p>
            ) : (
              <div className="space-y-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between rounded-dos border border-dos-line bg-dos-panel px-3 py-2"
                  >
                    <span className="text-sm font-medium text-dos-fg">{client.name}</span>
                    <Button size="sm" variant="danger" onClick={() => removeClient(client.id)}>
                      Elimina
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Progetti Attivi</CardTitle>
          <CardDescription>Vista operativa dei progetti con cliente, team assegnato e task associati.</CardDescription>
        </CardHeader>

        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessun progetto creato. Aggiungi il primo progetto dal pannello sopra.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Progetto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const clientName = clientsById.get(project.clientId)?.name ?? "Nessun cliente";
                  const assignedMembers = project.memberIds
                    .map((memberId) => membersById.get(memberId)?.fullName)
                    .filter((fullName): fullName is string => Boolean(fullName));
                  const taskCount = taskCountByProject.get(project.id) ?? 0;

                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{clientName}</TableCell>
                      <TableCell>
                        {assignedMembers.length > 0 ? assignedMembers.join(", ") : "Nessun membro assegnato"}
                      </TableCell>
                      <TableCell>{taskCount}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="danger" onClick={() => removeProject(project.id)}>
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
