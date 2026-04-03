"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createInitialProjectCatalogState,
  readProjectCatalogFromStorage,
  writeProjectCatalogToStorage
} from "@/features/project-catalog/storage";
import type {
  Client,
  Project,
  ProjectCatalogState,
  ProjectTask,
  TeamMember
} from "@/features/project-catalog/types";

interface CreateTeamMemberInput {
  fullName: string;
  role: string;
  email: string;
}

interface CreateProjectInput {
  name: string;
  clientId: string;
  memberIds: string[];
}

interface CreateTaskInput {
  projectId: string;
  name: string;
}

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function dedupeMemberIds(memberIds: string[]): string[] {
  return Array.from(new Set(memberIds));
}

export function useProjectCatalog() {
  const [state, setState] = useState<ProjectCatalogState>(createInitialProjectCatalogState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const persistedState = readProjectCatalogFromStorage();
    setState(persistedState);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeProjectCatalogToStorage(state);
  }, [isHydrated, state]);

  const addClient = useCallback((name: string): Client | null => {
    const normalizedName = normalizeText(name);
    if (!normalizedName) {
      return null;
    }

    const existingClient = state.clients.find(
      (client) => client.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase()
    );
    if (existingClient) {
      return existingClient;
    }

    const nowISO = new Date().toISOString();
    const nextClient: Client = {
      id: createId("client"),
      name: normalizedName,
      createdAtISO: nowISO
    };

    setState((previous) => ({
      ...previous,
      clients: [nextClient, ...previous.clients]
    }));

    return nextClient;
  }, [state.clients]);

  const removeClient = useCallback((clientId: string) => {
    setState((previous) => ({
      ...previous,
      clients: previous.clients.filter((client) => client.id !== clientId),
      projects: previous.projects.map((project) =>
        project.clientId === clientId
          ? {
              ...project,
              clientId: ""
            }
          : project
      )
    }));
  }, []);

  const addTeamMember = useCallback((input: CreateTeamMemberInput): TeamMember | null => {
    const fullName = normalizeText(input.fullName);
    const role = normalizeText(input.role);
    const email = normalizeText(input.email);

    if (!fullName) {
      return null;
    }

    const nowISO = new Date().toISOString();

    const nextMember: TeamMember = {
      id: createId("member"),
      fullName,
      role,
      email,
      createdAtISO: nowISO
    };

    setState((previous) => ({
      ...previous,
      teamMembers: [nextMember, ...previous.teamMembers]
    }));

    return nextMember;
  }, []);

  const removeTeamMember = useCallback((memberId: string) => {
    setState((previous) => ({
      ...previous,
      teamMembers: previous.teamMembers.filter((member) => member.id !== memberId),
      projects: previous.projects.map((project) => ({
        ...project,
        memberIds: project.memberIds.filter((id) => id !== memberId)
      }))
    }));
  }, []);

  const addProject = useCallback((input: CreateProjectInput): Project | null => {
    const name = normalizeText(input.name);
    const clientId = input.clientId;
    const memberIds = dedupeMemberIds(input.memberIds);

    if (!name) {
      return null;
    }

    const nowISO = new Date().toISOString();

    const nextProject: Project = {
      id: createId("project"),
      name,
      clientId,
      memberIds,
      status: "active",
      createdAtISO: nowISO
    };

    setState((previous) => ({
      ...previous,
      projects: [nextProject, ...previous.projects]
    }));

    return nextProject;
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setState((previous) => ({
      ...previous,
      projects: previous.projects.filter((project) => project.id !== projectId),
      tasks: previous.tasks.filter((task) => task.projectId !== projectId)
    }));
  }, []);

  const addTask = useCallback((input: CreateTaskInput): ProjectTask | null => {
    const name = normalizeText(input.name);
    const projectId = input.projectId;

    if (!name || !projectId) {
      return null;
    }

    const nowISO = new Date().toISOString();

    const nextTask: ProjectTask = {
      id: createId("task"),
      projectId,
      name,
      createdAtISO: nowISO
    };

    setState((previous) => ({
      ...previous,
      tasks: [nextTask, ...previous.tasks]
    }));

    return nextTask;
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setState((previous) => ({
      ...previous,
      tasks: previous.tasks.filter((task) => task.id !== taskId)
    }));
  }, []);

  const clearCatalog = useCallback(() => {
    setState(createInitialProjectCatalogState());
  }, []);

  const projectsById = useMemo(() => {
    const map = new Map<string, Project>();
    state.projects.forEach((project) => map.set(project.id, project));
    return map;
  }, [state.projects]);

  const clientsById = useMemo(() => {
    const map = new Map<string, Client>();
    state.clients.forEach((client) => map.set(client.id, client));
    return map;
  }, [state.clients]);

  const membersById = useMemo(() => {
    const map = new Map<string, TeamMember>();
    state.teamMembers.forEach((member) => map.set(member.id, member));
    return map;
  }, [state.teamMembers]);

  return {
    clients: state.clients,
    teamMembers: state.teamMembers,
    projects: state.projects,
    tasks: state.tasks,
    projectsById,
    clientsById,
    membersById,
    isHydrated,
    addClient,
    removeClient,
    addTeamMember,
    removeTeamMember,
    addProject,
    removeProject,
    addTask,
    removeTask,
    clearCatalog
  };
}
