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
import { useProjectCatalog } from "@/features/project-catalog/use-project-catalog";

export default function Page() {
  const { teamMembers, projects, isHydrated, addTeamMember, removeTeamMember } = useProjectCatalog();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const assignedProjectCountByMember = useMemo(() => {
    const map = new Map<string, number>();

    projects.forEach((project) => {
      project.memberIds.forEach((memberId) => {
        map.set(memberId, (map.get(memberId) ?? 0) + 1);
      });
    });

    return map;
  }, [projects]);

  const handleCreateMember = () => {
    const createdMember = addTeamMember({
      fullName,
      role,
      email
    });

    if (!createdMember) {
      return;
    }

    setFullName("");
    setRole("");
    setEmail("");
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">Team</p>
        <h1 className="text-2xl font-semibold text-dos-fg">Membri Operativi</h1>
        <p className="text-sm text-dos-fg/70">
          Gestisci il team disponibile per l’assegnazione ai progetti e ai flussi di tracking.
        </p>
      </header>

      {!isHydrated ? <p className="text-sm text-dos-fg/70">Caricamento team in corso...</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Nuovo Membro</CardTitle>
          <CardDescription>Aggiungi una persona da assegnare ai progetti.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Nome"
              placeholder="Es. Giulia Bianchi"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              label="Ruolo"
              placeholder="Es. Product Designer"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
            <Input
              label="Email"
              placeholder="nome@azienda.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <Button onClick={handleCreateMember}>Aggiungi membro</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Disponibile</CardTitle>
          <CardDescription>Panoramica membri e numero di progetti assegnati.</CardDescription>
        </CardHeader>

        <CardContent>
          {teamMembers.length === 0 ? (
            <p className="text-sm text-dos-fg/70">Nessun membro presente. Aggiungi il primo dal pannello sopra.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Progetti</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell>{member.role || "-"}</TableCell>
                    <TableCell>{member.email || "-"}</TableCell>
                    <TableCell>{assignedProjectCountByMember.get(member.id) ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="danger" onClick={() => removeTeamMember(member.id)}>
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
