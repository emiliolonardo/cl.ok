import type { ReactNode } from "react";
import Link from "next/link";

const modules = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/timer", label: "Live Timer" },
  { href: "/entries", label: "Time Entries" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
  { href: "/analytics", label: "Analytics" },
  { href: "/reports", label: "Reports" },
  { href: "/abcde", label: "ABCoDE" },
  { href: "/mesh", label: "Mesh" },
  { href: "/prompt-ops", label: "Prompt Ops" }
];

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dos-bg text-dos-fg">
      <header className="h-14 border-b border-dos-line bg-white px-6 flex items-center justify-between">
        <div className="text-sm tracking-wide uppercase font-medium">D.O.S. Time OS</div>
        <div className="text-xs font-medium text-dos-primary">Live Session: 00:00:00</div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        <aside className="w-64 border-r border-dos-line bg-white p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">
            Modules
          </p>
          <nav className="space-y-1">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="block rounded-dos border border-transparent px-3 py-2 text-sm hover:border-dos-line hover:bg-dos-panel"
              >
                {module.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <section className="mb-6 border border-dos-line bg-white p-4 shadow-dos-sm">
            <p className="text-[11px] uppercase tracking-[0.12em] text-dos-primary font-medium">
              Live Tracking Bar
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="inline-block h-2 w-2 bg-dos-accent" />
              <span>Project: System Prototype</span>
              <span className="text-dos-primary">|</span>
              <span>Task: Interface Mapping</span>
              <span className="text-dos-primary">|</span>
              <span>ABCoDE: Build-up</span>
            </div>
          </section>

          <section className="border border-dos-line bg-white p-4 shadow-dos-sm">{children}</section>
        </main>
      </div>
    </div>
  );
}
