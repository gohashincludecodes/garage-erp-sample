import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageTitle, Panel, Pill } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import { customers, jobTotal, money, vehicles } from "@/lib/garage-data";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices & Payments — AxleOS" },
      { name: "description", content: "Billing, payment status and gate-pass clearance for finished jobs." },
      { property: "og:title", content: "Invoices & Payments — AxleOS" },
      { property: "og:description", content: "Billing, payment status and gate-pass clearance for finished jobs." },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const { jobs, markPaid, issueGatePass } = useGarage();
  const billable = jobs.filter((j) => j.estimateApproved);
  const collected = billable.filter((j) => j.paid).reduce((s, j) => s + jobTotal(j), 0);
  const receivable = billable.filter((j) => !j.paid).reduce((s, j) => s + jobTotal(j), 0);

  return (
    <AppShell>
      <PageTitle title="INVOICES" meta={`${money(collected)} collected · ${money(receivable)} receivable`} />
      <div className="px-6 py-3 pb-8">
        <Panel title="Billing register" meta="Cashier desk">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-muted uppercase text-[10px] bg-surface/60">
                <th className="text-left px-3 py-2">Invoice</th>
                <th className="text-left px-3 py-2">Job</th>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-left px-3 py-2">Vehicle</th>
                <th className="text-left px-3 py-2">Payer</th>
                <th className="text-right px-3 py-2">Total</th>
                <th className="text-left px-3 py-2 pl-5">Payment</th>
                <th className="text-left px-3 py-2">Gate pass</th>
                <th className="text-right px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {billable.map((job) => {
                const v = vehicles.find((x) => x.id === job.vehicleId)!;
                const c = customers.find((x) => x.id === job.customerId)!;
                return (
                  <tr key={job.id} className="border-t border-line hover:bg-surface2/60">
                    <td className="px-3 py-2 text-accent">INV-{job.id.slice(-4)}</td>
                    <td className="px-3 py-2">
                      <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="text-accent">
                        {job.id}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-body text-muted">{c.name}</td>
                    <td className="px-3 py-2 font-body">
                      {v.make} {v.model} <span className="text-muted">{v.plate}</span>
                    </td>
                    <td className="px-3 py-2 text-muted">{job.insurance ? job.insurance.insurer : c.type}</td>
                    <td className="px-3 py-2 text-right">{money(jobTotal(job))}</td>
                    <td className="px-3 py-2 pl-5">
                      {job.paid ? <Pill tone="ok">Paid</Pill> : <Pill tone="warn">Unpaid</Pill>}
                    </td>
                    <td className="px-3 py-2">
                      {job.gatePass ? <Pill tone="ok">Issued</Pill> : <Pill tone="muted">Held</Pill>}
                    </td>
                    <td className="px-3 py-2 text-right space-x-1">
                      <button
                        disabled={job.paid}
                        onClick={() => markPaid(job.id)}
                        className="rounded-md bg-accent px-2 py-1 font-semibold text-background disabled:bg-line disabled:text-muted"
                      >
                        Pay
                      </button>
                      <button
                        disabled={!job.paid || job.gatePass}
                        onClick={() => issueGatePass(job.id)}
                        className="rounded-md ring-1 ring-line bg-surface2 px-2 py-1 text-foreground disabled:text-muted"
                      >
                        Gate pass
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>
    </AppShell>
  );
}
