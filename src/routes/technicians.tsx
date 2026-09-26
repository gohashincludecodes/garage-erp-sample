import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageTitle, Panel, Pill, TechAvatar } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import { technicians, vehicles } from "@/lib/garage-data";

export const Route = createFileRoute("/technicians")({
  head: () => ({
    meta: [
      { title: "Technicians — AxleOS" },
      { name: "description", content: "Workshop crew, skills, shift and current job assignments." },
      { property: "og:title", content: "Technicians — AxleOS" },
      { property: "og:description", content: "Workshop crew, skills, shift and current job assignments." },
    ],
  }),
  component: TechniciansPage,
});

function TechniciansPage() {
  const { jobs } = useGarage();

  return (
    <AppShell>
      <PageTitle title="TECHNICIANS" meta={`${technicians.length} on shift`} />
      <div className="px-6 py-3 pb-8 grid grid-cols-2 gap-3 items-start">
        {technicians.map((t) => {
          const assigned = jobs.filter(
            (j) => j.stage !== "Delivered" && j.tasks.some((task) => task.techId === t.id),
          );
          return (
            <Panel key={t.id} title={t.role} meta={t.shift}>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <TechAvatar tech={t} />
                  <div>
                    <div className="font-display text-2xl leading-none">{t.name}</div>
                    <div className="font-mono text-[10px] text-muted mt-1">
                      {t.skills.join(" · ")}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-display text-2xl leading-none">{t.utilisation}%</div>
                    <div className="font-mono text-[10px] text-muted">utilisation</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-line overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${t.utilisation}%` }} />
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted">
                  Assigned jobs
                </div>
                <ul className="mt-2 space-y-1.5">
                  {assigned.length === 0 ? (
                    <li className="font-mono text-[11px] text-muted">No open jobs.</li>
                  ) : (
                    assigned.map((j) => {
                      const v = vehicles.find((x) => x.id === j.vehicleId)!;
                      return (
                        <li key={j.id} className="flex items-center gap-2 text-xs">
                          <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-mono text-accent">
                            {j.id}
                          </Link>
                          <span>
                            {v.make} {v.model}
                          </span>
                          <span className="font-mono text-[10px] text-muted">{v.plate}</span>
                          <span className="ml-auto">
                            <Pill tone={j.stage === "In Progress" ? "info" : "muted"}>{j.stage}</Pill>
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
