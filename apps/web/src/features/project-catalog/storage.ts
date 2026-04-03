import {
  PROJECT_CATALOG_STORAGE_KEY,
  type Client,
  type Project,
  type ProjectCatalogState,
  type ProjectStatus,
  type ProjectTask,
  type TeamMember
} from "@/features/project-catalog/types";

interface ParsedState {
  clients?: unknown;
  teamMembers?: unknown;
  projects?: unknown;
  tasks?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toStatus(value: unknown): ProjectStatus {
  return value === "active" || value === "archived" ? value : "active";
}

function toTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toText).filter(Boolean);
}

function toClient(value: unknown): Client | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toText(value.id);
  const name = toText(value.name).trim();
  const createdAtISO = toText(value.createdAtISO);

  if (!id || !name || !createdAtISO) {
    return null;
  }

  return {
    id,
    name,
    createdAtISO
  };
}

function toTeamMember(value: unknown): TeamMember | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toText(value.id);
  const fullName = toText(value.fullName).trim();
  const role = toText(value.role).trim();
  const email = toText(value.email).trim();
  const createdAtISO = toText(value.createdAtISO);

  if (!id || !fullName || !createdAtISO) {
    return null;
  }

  return {
    id,
    fullName,
    role,
    email,
    createdAtISO
  };
}

function toProject(value: unknown): Project | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toText(value.id);
  const name = toText(value.name).trim();
  const clientId = toText(value.clientId);
  const memberIds = toTextArray(value.memberIds);
  const status = toStatus(value.status);
  const createdAtISO = toText(value.createdAtISO);

  if (!id || !name || !createdAtISO) {
    return null;
  }

  return {
    id,
    name,
    clientId,
    memberIds,
    status,
    createdAtISO
  };
}

function toTask(value: unknown): ProjectTask | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toText(value.id);
  const projectId = toText(value.projectId);
  const name = toText(value.name).trim();
  const createdAtISO = toText(value.createdAtISO);

  if (!id || !projectId || !name || !createdAtISO) {
    return null;
  }

  return {
    id,
    projectId,
    name,
    createdAtISO
  };
}

export function createInitialProjectCatalogState(): ProjectCatalogState {
  return {
    clients: [],
    teamMembers: [],
    projects: [],
    tasks: []
  };
}

export function readProjectCatalogFromStorage(): ProjectCatalogState {
  const initialState = createInitialProjectCatalogState();

  if (typeof window === "undefined") {
    return initialState;
  }

  const raw = window.localStorage.getItem(PROJECT_CATALOG_STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as ParsedState;

    const clients = Array.isArray(parsed.clients)
      ? parsed.clients.map(toClient).filter((client): client is Client => client !== null)
      : [];

    const teamMembers = Array.isArray(parsed.teamMembers)
      ? parsed.teamMembers.map(toTeamMember).filter((member): member is TeamMember => member !== null)
      : [];

    const projects = Array.isArray(parsed.projects)
      ? parsed.projects.map(toProject).filter((project): project is Project => project !== null)
      : [];

    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.map(toTask).filter((task): task is ProjectTask => task !== null)
      : [];

    return {
      clients,
      teamMembers,
      projects,
      tasks
    };
  } catch {
    return initialState;
  }
}

export function writeProjectCatalogToStorage(state: ProjectCatalogState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROJECT_CATALOG_STORAGE_KEY, JSON.stringify(state));
}
