import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell, Panel, Pill, StagePill, TechAvatar } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import {
  STAGES,
  TAX_RATE,
  customers,
  jobLabour,
  jobPartsTotal,
  jobSubtotal,
  jobTotal,
  money,
  technicians,
  vehicles,
} from "@/lib/garage-data";

export const Route = createFileRoute("/jobs/$jobId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.jobId} — Job Card — AxleOS` },
      { name: "description", content: `Job card ${params.jobId}: tasks, parts, QC, invoice and delivery.` },
      { property: "og:title", content: `${params.jobId} — Job Card — AxleOS` },
      { property: "og:description", content: `Job card ${params.jobId}: tasks, parts, QC, invoice and delivery.` },
    ],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { jobId } = Route.useParams();
  const { jobs, advance, approveEstimate, setTaskStatus, issuePart, toggleQc, markPaid, issueGatePass } =
    useGarage();
  const job = jobs.find((j) => j.id === jobId);

  if (!job) throw notFound();

  const vehicle = vehicles.find((v) => v.id === job.vehicleId)!;
  const customer = customers.find((c) => c.id === job.customerId)!;
  const stageIndex = STAGES.indexOf(job.stage);
  const qcPassed = job.qc.length > 0 && job.qc.every((q) => q.passed);

  return (
    <AppShell>
      <div className="px-6 pt-5 pb-2 flex items-end gap-3 flex-wrap">
        <Link to="/jobs" className="font-mono text-[11px] text-muted hover:text-accent pb-1.5">
          ← Jobs
        </Link>
        <h1 className="font-display text-4xl tracking-wide leading-none">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>
        <span className="font-mono text-[11px] text-muted pb-1">
          {job.id} · {vehicle.plate} · {job.bay}
        </span>
        <div className="pb-1">
          <StagePill stage={job.stage} />
        </div>
        <div className="ml-auto flex gap-2 pb-0.5">
          {!job.estimateApproved ? (
            <button
              onClick={() => approveEstimate(job.id)}
              className="rounded-md bg-warn px-3 py-1.5 font-semibold text-background text-xs"
            >
              Approve estimate
            </button>
          ) : null}
          <button
            disabled={job.stage === "Delivered"}
            onClick={() => advance(job.id)}
            className="rounded-md bg-accent px-3 py-1.5 font-semibold text-background text-xs disabled:bg-line disabled:text-muted"
          >
            Advance stage
          </button>
        </div>
      </div>

      <div className="px-6 py-3">
        <div className="rounded-lg ring-1 ring-line bg-surface2 p-3 relative overflow-hidden">
          <div className="sheen" />
          <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
            {STAGES.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className={`font-mono ${i < stageIndex ? "text-accent" : i === stageIndex ? "text-warn" : "text-muted"}`}
                >
                  {s}
                  {i < stageIndex ? " ✓" : ""}
                </span>
                {i < STAGES.length - 1 ? <span className="text-line">▸</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 grid grid-cols-3 gap-3 items-start">
        <div className="col-span-2 space-y-3">
          <Panel title="Job summary" meta={job.priority.toUpperCase()}>
            <div className="p-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-mono text-[10px] text-muted uppercase">Customer complaint</div>
                <p className="mt-1 text-sm">{job.complaint}</p>
                <div className="font-mono text-[10px] text-muted uppercase mt-3">Service type</div>
                <p className="mt-1">{job.serviceType}</p>
              </div>
              <div className="font-mono space-y-1.5">
                <Row k="Customer" v={customer.name} />
                <Row k="Contact" v={customer.phone} />
                <Row k="VIN" v={vehicle.vin} />
                <Row k="Odometer" v={`${vehicle.odometer.toLocaleString()} km`} />
                <Row k="Promised" v={job.promised} />
                {job.insurance ? (
                  <>
                    <Row k="Insurer" v={job.insurance.insurer} />
                    <Row k="Claim no." v={job.insurance.claimNo} />
                    <Row k="Approved" v={money(job.insurance.approved)} />
                  </>
                ) : null}
              </div>
            </div>
          </Panel>

          <Panel title="Tasks / operations" meta={`${job.tasks.length} operations`}>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-muted uppercase text-[10px] bg-surface/60">
                  <th className="text-left px-3 py-2">Operation</th>
                  <th className="text-left px-3 py-2">Technician</th>
                  <th className="text-right px-3 py-2">Hours</th>
                  <th className="text-right px-3 py-2">Labour</th>
                  <th className="text-left px-3 py-2 pl-5">Status</th>
                  <th className="text-right px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {job.tasks.map((t) => {
                  const tech = technicians.find((x) => x.id === t.techId);
                  return (
                    <tr key={t.id} className="border-t border-line">
                      <td className="px-3 py-2 font-body">{t.name}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-2">
                          <TechAvatar tech={tech} />
                          <span className="font-body text-muted">{tech?.name}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">{t.hours}</td>
                      <td className="px-3 py-2 text-right">{money(t.hours * t.rate)}</td>
                      <td className="px-3 py-2 pl-5">
                        <Pill
                          tone={
                            t.status === "Done" ? "ok" : t.status === "Running" ? "info" : t.status === "Paused" ? "warn" : "muted"
                          }
                        >
                          {t.status}
                        </Pill>
                      </td>
                      <td className="px-3 py-2 text-right space-x-1">
                        {t.status !== "Done" ? (
                          <>
                            <button
                              onClick={() => setTaskStatus(job.id, t.id, t.status === "Running" ? "Paused" : "Running")}
                              className="rounded-md ring-1 ring-line bg-surface2 px-2 py-1 text-muted hover:text-foreground"
                            >
                              {t.status === "Running" ? "Pause" : "Start"}
                            </button>
                            <button
                              onClick={() => setTaskStatus(job.id, t.id, "Done")}
                              className="rounded-md bg-accent px-2 py-1 font-semibold text-background"
                            >
                              Done
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>

          <Panel title="Parts / materials" meta={money(jobPartsTotal(job))}>
            {job.parts.length === 0 ? (
              <div className="px-3 py-4 font-mono text-[11px] text-muted">No parts requested yet.</div>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-muted uppercase text-[10px] bg-surface/60">
                    <th className="text-left px-3 py-2">SKU</th>
                    <th className="text-left px-3 py-2">Part</th>
                    <th className="text-right px-3 py-2">Qty</th>
                    <th className="text-right px-3 py-2">Amount</th>
                    <th className="text-right px-3 py-2">Store</th>
                  </tr>
                </thead>
                <tbody>
                  {job.parts.map((p) => (
                    <tr key={p.sku} className="border-t border-line">
                      <td className="px-3 py-2 text-accent">{p.sku}</td>
                      <td className="px-3 py-2 font-body">{p.name}</td>
                      <td className="px-3 py-2 text-right">{p.qty}</td>
                      <td className="px-3 py-2 text-right">{money(p.qty * p.unitPrice)}</td>
                      <td className="px-3 py-2 text-right">
                        {p.issued ? (
                          <Pill tone="ok">Issued</Pill>
                        ) : (
                          <button
                            onClick={() => issuePart(job.id, p.sku)}
                            className="rounded-md bg-accent px-2 py-1 font-semibold text-background"
                          >
                            Issue
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel title="QC checklist" meta={job.qc.length ? (qcPassed ? "PASSED" : "OPEN") : "NOT STARTED"}>
            {job.qc.length === 0 ? (
              <div className="px-3 py-4 font-mono text-[11px] text-muted">
                QC opens once workshop tasks are complete.
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {job.qc.map((q) => (
                  <li key={q.id} className="flex items-center gap-3 px-3 py-2 text-xs">
                    <button
                      onClick={() => toggleQc(job.id, q.id)}
                      className={`size-4 rounded-sm ring-1 grid place-items-center font-mono text-[10px] ${
                        q.passed ? "bg-ok/20 text-ok ring-ok/40" : "bg-surface2 text-muted ring-line"
                      }`}
                    >
                      {q.passed ? "✓" : ""}
                    </button>
                    <span className={q.passed ? "text-muted line-through" : ""}>{q.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Invoice" meta={job.paid ? "PAID" : "UNPAID"}>
            <div className="p-4 font-mono text-xs space-y-1.5">
              <Row k="Labour" v={money(jobLabour(job))} />
              <Row k="Parts" v={money(jobPartsTotal(job))} />
              <Row k="Subtotal" v={money(jobSubtotal(job))} />
              <Row k={`Tax ${Math.round(TAX_RATE * 100)}%`} v={money(Math.round(jobSubtotal(job) * TAX_RATE))} />
              <div className="border-t border-line pt-2 mt-2 flex justify-between items-baseline">
                <span className="text-muted uppercase text-[10px]">Total</span>
                <span className="font-display text-2xl">{money(jobTotal(job))}</span>
              </div>
              {job.insurance ? (
                <p className="text-[10px] text-muted pt-1">
                  Insurer covers {money(job.insurance.approved)} · customer share{" "}
                  {money(Math.max(0, jobTotal(job) - job.insurance.approved))}
                </p>
              ) : null}
              <div className="pt-3 space-y-2">
                <button
                  disabled={job.paid}
                  onClick={() => markPaid(job.id)}
                  className="w-full rounded-md bg-accent px-3 py-2 font-semibold text-background disabled:bg-line disabled:text-muted"
                >
                  {job.paid ? "Payment received" : "Record payment"}
                </button>
                <button
                  disabled={!job.paid || job.gatePass}
                  onClick={() => issueGatePass(job.id)}
                  className="w-full rounded-md ring-1 ring-line bg-surface2 px-3 py-2 font-semibold text-foreground disabled:text-muted"
                >
                  {job.gatePass ? "Gate pass issued" : "Issue gate pass"}
                </button>
              </div>
            </div>
          </Panel>

          <Panel title="Audit timeline" meta={`${job.timeline.length} events`}>
            <ol className="p-4 space-y-3 border-l-2 border-line ml-5">
              {job.timeline.map((e, i) => (
                <li key={i} className="relative pl-3">
                  <span
                    className={`absolute -left-[21px] top-1.5 size-2 rounded-full ${
                      i === job.timeline.length - 1 ? "bg-warn ring-2 ring-warn/25" : "bg-ok"
                    }`}
                  />
                  <div className="text-xs font-medium">{e.label}</div>
                  <div className="font-mono text-[10px] text-muted">
                    {e.at} · {e.by}
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted uppercase text-[10px]">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}
