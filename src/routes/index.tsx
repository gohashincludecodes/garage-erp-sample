import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageTitle, StagePill, TechStack } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import {
  STAGES,
  customers,
  jobTotal,
  money,
  vehicles,
  type Job,
  type Stage,
} from "@/lib/garage-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workshop Operations — AxleOS" },
      { name: "description", content: "Live bay board, job queue and workshop KPIs for the garage." },
      { property: "og:title", content: "Workshop Operations — AxleOS" },
      { property: "og:description", content: "Live bay board, job queue and workshop KPIs for the garage." },
    ],
  }),
  component: Operations,
});

function vehicleOf(job: Job) {
  return vehicles.find((v) => v.id === job.vehicleId)!;
}
function customerOf(job: Job) {
  return customers.find((c) => c.id === job.customerId)!;
}

function Kpi({
  label,
  value,
  note,
  tone,
  delay,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "accent" | "warn" | "muted";
  delay: number;
}) {
  const t = tone === "warn" ? "text-warn" : tone === "muted" ? "text-muted" : "text-accent";
  return (
    <div
      className="slide rounded-xl ring-1 ring-line bg-surface2 p-4 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="sheen" />
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`font-display text-4xl leading-none mt-1 ${tone === "warn" ? "text-warn" : ""}`}>
        {value}
      </div>
      <div className={`font-mono text-[11px] mt-1 ${t}`}>{note}</div>
    </div>
  );
}

function Operations() {
  const { jobs } = useGarage();

  const inWorkshop = jobs.filter((j) => j.stage !== "Delivered").length;
  const revenue = jobs.filter((j) => j.paid).reduce((s, j) => s + jobTotal(j), 0);
  const pending = jobs.filter((j) => !j.estimateApproved);
  const pendingValue = pending.reduce((s, j) => s + jobTotal(j), 0);
  const busyBays = new Set(jobs.filter((j) => j.bay !== "—").map((j) => j.bay)).size;
  const active = jobs.find((j) => j.stage === "In Progress") ?? jobs[0];
  if (!active) return null;
  const activeVehicle = vehicleOf(active);

  return (
    <AppShell>
      <PageTitle title="WORKSHOP OPS" meta="BAY 1–8 · LIVE" />

      <div className="grid grid-cols-4 gap-3 px-6 py-3">
        <Kpi label="In workshop" value={String(inWorkshop)} note="+3 since 06:00" delay={0} />
        <Kpi label="Revenue today" value={money(revenue)} note={`${jobs.filter((j) => j.paid).length} invoices paid`} delay={60} />
        <Kpi
          label="Pending approvals"
          value={String(pending.length)}
          note={`${money(pendingValue)} held`}
          tone="warn"
          delay={120}
        />
        <Kpi
          label="Bay utilisation"
          value={`${Math.round((busyBays / 8) * 100)}%`}
          note={`${8 - busyBays} idle`}
          tone="muted"
          delay={180}
        />
      </div>

      <div className="px-6 py-3 flex gap-3 items-start">
        <Link
          to="/jobs/$jobId"
          params={{ jobId: active.id }}
          className="shrink-0 rounded-lg ring-1 ring-accent/30 bg-accent/5 p-3 w-52 relative overflow-hidden block hover:ring-accent/60"
        >
          <div className="sheen" />
          <div className="font-mono text-[10px] text-accent uppercase tracking-wider">Active job</div>
          <div className="font-mono text-xs mt-1 text-muted">{active.id}</div>
          <div className="font-display text-xl leading-none mt-0.5">
            {activeVehicle.year} {activeVehicle.model}
          </div>
          <div className="font-mono text-xs text-muted mt-1">Plate {activeVehicle.plate}</div>
          <div className="mt-2 inline-flex">
            <StagePill stage={active.stage} />
          </div>
        </Link>
        <div className="flex-1 rounded-lg ring-1 ring-line bg-surface2 p-3 relative overflow-hidden">
          <div className="sheen sheen-d2" />
          <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">
            Status timeline · {active.id}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
            {STAGES.map((s, i) => {
              const cur = STAGES.indexOf(active.stage);
              const cls = i < cur ? "text-accent" : i === cur ? "text-warn" : "text-muted";
              return (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`font-mono ${cls}`}>
                    {s}
                    {i < cur ? " ✓" : ""}
                  </span>
                  {i < STAGES.length - 1 ? <span className="text-line">▸</span> : null}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-2">
        <h2 className="font-display text-2xl tracking-wide leading-none">BAY BOARD</h2>
      </div>
      <div className="grid grid-cols-7 gap-2 px-6 py-2 items-start">
        {STAGES.map((stage) => {
          const column = jobs.filter((j) => j.stage === stage);
          return (
            <div key={stage} className="rounded-lg ring-1 ring-line bg-surface/50 p-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                {stage} <span className="text-foreground">{column.length}</span>
              </div>
              <div className="space-y-2">
                {column.map((job) => {
                  const v = vehicleOf(job);
                  return (
                    <Link
                      key={job.id}
                      to="/jobs/$jobId"
                      params={{ jobId: job.id }}
                      className={`block rounded-md ring-1 bg-surface2 p-2 relative overflow-hidden hover:ring-accent/40 ${
                        stage === "Delivered" ? "ring-line opacity-70" : "ring-line"
                      }`}
                    >
                      <div className="font-mono text-[10px] text-accent">{job.id}</div>
                      <div className="text-xs font-semibold leading-tight mt-0.5">
                        {v.make} {v.model}
                      </div>
                      <div className="font-mono text-[10px] text-muted">{v.plate}</div>
                      <div className="mt-1.5">
                        <TechStack ids={job.tasks.map((t) => t.techId)} />
                      </div>
                    </Link>
                  );
                })}
                {column.length === 0 ? (
                  <div className="font-mono text-[10px] text-muted/60 px-1 py-2">empty</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-2 flex items-end gap-3">
        <h2 className="font-display text-2xl tracking-wide leading-none">JOB QUEUE</h2>
        <span className="font-mono text-[11px] text-muted pb-1">{jobs.length} records · sorted by stage</span>
      </div>
      <div className="px-6 pb-8">
        <div className="rounded-lg ring-1 ring-line overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface2 font-mono text-[10px] uppercase tracking-wider text-muted">
                <th className="text-left px-3 py-2">Job</th>
                <th className="text-left px-3 py-2">Vehicle</th>
                <th className="text-left px-3 py-2">Plate</th>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-left px-3 py-2">Bay</th>
                <th className="text-left px-3 py-2">Stage</th>
                <th className="text-right px-3 py-2">Est.</th>
                <th className="text-left px-3 py-2 pl-5">Techs</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[...jobs]
                .sort((a, b) => STAGES.indexOf(a.stage as Stage) - STAGES.indexOf(b.stage as Stage))
                .map((job) => {
                  const v = vehicleOf(job);
                  return (
                    <tr key={job.id} className="border-t border-line hover:bg-surface2/60">
                      <td className="px-3 py-2 text-accent">
                        <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
                          {job.id}
                        </Link>
                      </td>
                      <td className="px-3 py-2 font-body">
                        {v.make} {v.model}
                      </td>
                      <td className="px-3 py-2 text-muted">{v.plate}</td>
                      <td className="px-3 py-2 font-body text-muted">{customerOf(job).name}</td>
                      <td className="px-3 py-2">{job.bay}</td>
                      <td className="px-3 py-2">
                        <StagePill stage={job.stage} />
                      </td>
                      <td className="px-3 py-2 text-right">{money(jobTotal(job))}</td>
                      <td className="px-3 py-2">
                        <TechStack ids={job.tasks.map((t) => t.techId)} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
