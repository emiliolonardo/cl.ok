export const PROJECT_CATALOG_STORAGE_KEY = "dos-project-catalog-v1";

export interface Client {
  id: string;
  name: string;
  createdAtISO: string;
}

export interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  email: string;
  createdAtISO: string;
}

export type ProjectStatus = "active" | "archived";

export interface Project {
  id: string;
  name: string;
  clientId: string;
  memberIds: string[];
  status: ProjectStatus;
  createdAtISO: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  name: string;
  createdAtISO: string;
}

export interface ProjectCatalogState {
  clients: Client[];
  teamMembers: TeamMember[];
  projects: Project[];
  tasks: ProjectTask[];
}
