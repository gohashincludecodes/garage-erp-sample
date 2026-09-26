import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageTitle, Pill, StagePill, TechStack } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import { STAGES, customers, jobTotal, money, vehicles, type Stage } from "@/lib/garage-data";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Job Cards — AxleOS" },
      { name: "description", content: "Every workshop job card with stage, bay, promised time and value." },
      { property: "og:title", content: "Job Cards — AxleOS" },
      { property: "og:description", content: "Every workshop job card with stage, bay, promised time and value." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const { jobs, advance } = useGarage();
  const [filter, setFilter] = useState<Stage | "All">("All");

  const list = jobs.filter((j) => filter === "All" || j.stage === filter);

  return (
    <AppShell>
      <PageTitle title="JOB CARDS" meta={`${jobs.length} total · ${list.length} shown`} />

      <div className="px-6 py-2 flex flex-wrap gap-1.5">
        {(["All", ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-md px-2.5 py-1 font-mono text-[11px] uppercase ring-1 ${
              filter === s
                ? "bg-accent/10 text-accent ring-accent/30"
                : "bg-surface2 text-muted ring-line hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="px-6 pb-8 pt-2">
        <div className="rounded-lg ring-1 ring-line overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface2 font-mono text-[10px] uppercase tracking-wider text-muted">
                <th className="text-left px-3 py-2">Job</th>
                <th className="text-left px-3 py-2">Vehicle / Plate</th>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-left px-3 py-2">Service</th>
                <th className="text-left px-3 py-2">Promised</th>
                <th className="text-left px-3 py-2">Priority</th>
                <th className="text-left px-3 py-2">Stage</th>
                <th className="text-right px-3 py-2">Value</th>
                <th className="text-left px-3 py-2 pl-5">Techs</th>
                <th className="text-right px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {list.map((job) => {
                const v = vehicles.find((x) => x.id === job.vehicleId)!;
                const c = customers.find((x) => x.id === job.customerId)!;
                return (
                  <tr key={job.id} className="border-t border-line hover:bg-surface2/60">
                    <td className="px-3 py-2 text-accent">
                      <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
                        {job.id}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-body font-medium">
                        {v.make} {v.model}
                      </span>{" "}
                      <span className="text-muted">{v.plate}</span>
                    </td>
                    <td className="px-3 py-2 font-body text-muted">{c.name}</td>
                    <td className="px-3 py-2 font-body text-muted">{job.serviceType}</td>
                    <td className="px-3 py-2 text-muted">{job.promised}</td>
                    <td className="px-3 py-2">
                      <Pill tone={job.priority === "Urgent" ? "danger" : job.priority === "High" ? "warn" : "muted"}>
                        {job.priority}
                      </Pill>
                    </td>
                    <td className="px-3 py-2">
                      <StagePill stage={job.stage} />
                    </td>
                    <td className="px-3 py-2 text-right">{money(jobTotal(job))}</td>
                    <td className="px-3 py-2">
                      <TechStack ids={job.tasks.map((t) => t.techId)} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        disabled={job.stage === "Delivered"}
                        onClick={() => advance(job.id)}
                        className="rounded-md bg-accent px-2 py-1 font-semibold text-background disabled:bg-line disabled:text-muted"
                      >
                        Advance
                      </button>
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
