import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Stage, Technician } from "@/lib/garage-data";
import { technicians } from "@/lib/garage-data";

const NAV = [
  { n: "01", label: "Operations", to: "/" },
  { n: "02", label: "Jobs", to: "/jobs" },
  { n: "03", label: "Customers", to: "/customers" },
  { n: "04", label: "Vehicles", to: "/vehicles" },
  { n: "05", label: "Parts", to: "/parts" },
  { n: "06", label: "Invoices", to: "/invoices" },
  { n: "07", label: "Technicians", to: "/technicians" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-body text-sm">
      <aside className="w-56 shrink-0 border-r border-line bg-surface/60 flex flex-col">
        <div className="px-4 h-14 flex items-center gap-2 border-b border-line">
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="font-display text-2xl tracking-wide leading-none">
            AXLE<span className="text-accent">OS</span>
          </span>
        </div>
        <nav className="p-2.5 space-y-0.5 flex-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  active
                    ? "flex items-center gap-2.5 px-2.5 py-2 rounded-md bg-accent/10 text-accent ring-1 ring-accent/25"
                    : "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-muted hover:text-foreground hover:bg-surface2"
                }
              >
                <span className="font-mono text-[11px] opacity-60">{item.n}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-2.5 rounded-lg ring-1 ring-line bg-surface2 p-3 relative overflow-hidden">
          <div className="sheen" />
          <div className="font-mono text-[10px] text-muted uppercase tracking-wider">Shift · Day</div>
          <div className="font-display text-lg mt-0.5">8 bays · 4 techs</div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 border-b border-line flex items-center gap-3">
          <div className="font-mono text-xs text-muted">
            06:24:07 <span className="text-accent blink">▮</span> SHIFT DAY
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md ring-1 ring-line bg-surface px-3 py-1.5">
              <span className="text-muted text-xs">⌕</span>
              <span className="text-muted text-xs">Search jobs, plates…</span>
            </div>
            <Link
              to="/jobs"
              className="rounded-md bg-accent text-background font-semibold px-3 py-1.5 hover:brightness-110"
            >
              New job
            </Link>
            <div className="size-8 rounded-full ring-1 ring-line bg-surface2 grid place-items-center font-mono text-xs">
              MK
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function PageTitle({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="px-6 pt-5 pb-2 flex items-end gap-3">
      <h1 className="font-display text-4xl tracking-wide leading-none">{title}</h1>
      <span className="font-mono text-[11px] text-muted pb-1">{meta}</span>
    </div>
  );
}

const STAGE_TONE: Record<Stage, string> = {
  Intake: "bg-line/40 text-muted ring-line",
  Estimate: "bg-warn/15 text-warn ring-warn/30",
  Approved: "bg-info/15 text-info ring-info/30",
  "In Progress": "bg-accent/15 text-accent ring-accent/30",
  QC: "bg-info/15 text-info ring-info/30",
  Ready: "bg-ok/15 text-ok ring-ok/30",
  Delivered: "bg-line/40 text-muted ring-line",
};

export function StagePill({ stage }: { stage: Stage }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full ring-1 uppercase font-mono text-[10px] ${STAGE_TONE[stage]}`}
    >
      {stage}
    </span>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "warn" | "info" | "danger" | "muted"; children: ReactNode }) {
  const map = {
    ok: "bg-ok/15 text-ok ring-ok/30",
    warn: "bg-warn/15 text-warn ring-warn/30",
    info: "bg-info/15 text-info ring-info/30",
    danger: "bg-danger/15 text-danger ring-danger/30",
    muted: "bg-line/40 text-muted ring-line",
  } as const;
  return (
    <span className={`px-2 py-0.5 rounded-full ring-1 uppercase font-mono text-[10px] ${map[tone]}`}>
      {children}
    </span>
  );
}

const TONE_BG = { accent: "bg-accent", info: "bg-info", warn: "bg-warn", ok: "bg-ok" } as const;

export function TechAvatar({ tech }: { tech: Technician | undefined }) {
  if (!tech) return null;
  return (
    <span
      title={tech.name}
      className={`size-6 rounded-full ring-2 ring-surface ${TONE_BG[tech.tone]} text-[9px] text-background grid place-items-center font-mono`}
    >
      {tech.initials}
    </span>
  );
}

export function TechStack({ ids }: { ids: string[] }) {
  const unique = Array.from(new Set(ids));
  return (
    <div className="flex -space-x-1.5">
      {unique.map((id) => (
        <TechAvatar key={id} tech={technicians.find((t) => t.id === id)} />
      ))}
    </div>
  );
}

export function Panel({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return (
    <div className="rounded-lg ring-1 ring-line bg-surface/50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-line flex items-center justify-between bg-surface2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{title}</span>
        {meta ? <span className="font-mono text-[10px] text-muted">{meta}</span> : null}
      </div>
      {children}
    </div>
  );
}
