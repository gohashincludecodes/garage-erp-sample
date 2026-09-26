import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Panel, Pill } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import { money } from "@/lib/garage-data";

export const Route = createFileRoute("/parts")({
  head: () => ({
    meta: [
      { title: "Parts & Inventory — AxleOS" },
      { name: "description", content: "Spare parts stock, bin locations and reorder alerts for the store." },
      { property: "og:title", content: "Parts & Inventory — AxleOS" },
      { property: "og:description", content: "Spare parts stock, bin locations and reorder alerts for the store." },
    ],
  }),
  component: PartsPage,
});

function PartsPage() {
  const { parts, jobs } = useGarage();
  const low = parts.filter((p) => p.stock <= p.reorder);
  const pendingRequests = jobs.flatMap((j) =>
    j.parts.filter((p) => !p.issued).map((p) => ({ job: j.id, ...p })),
  );

  return (
    <AppShell>
      <PageTitle title="PARTS & STORE" meta={`${parts.length} SKUs · ${low.length} below reorder`} />
      <div className="px-6 py-3 pb-8 grid grid-cols-3 gap-3 items-start">
        <div className="col-span-2">
          <Panel title="Stock ledger" meta="Main store">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-muted uppercase text-[10px] bg-surface/60">
                  <th className="text-left px-3 py-2">SKU</th>
                  <th className="text-left px-3 py-2">Part</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-left px-3 py-2">Bin</th>
                  <th className="text-right px-3 py-2">Stock</th>
                  <th className="text-right px-3 py-2">Reorder</th>
                  <th className="text-right px-3 py-2">Unit</th>
                  <th className="text-left px-3 py-2 pl-5">State</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p) => (
                  <tr key={p.id} className="border-t border-line hover:bg-surface2/60">
                    <td className="px-3 py-2 text-accent">{p.sku}</td>
                    <td className="px-3 py-2 font-body">{p.name}</td>
                    <td className="px-3 py-2 text-muted">{p.category}</td>
                    <td className="px-3 py-2">{p.bin}</td>
                    <td className="px-3 py-2 text-right">{p.stock}</td>
                    <td className="px-3 py-2 text-right text-muted">{p.reorder}</td>
                    <td className="px-3 py-2 text-right">{money(p.unitPrice)}</td>
                    <td className="px-3 py-2 pl-5">
                      {p.stock <= p.reorder ? <Pill tone="danger">Reorder</Pill> : <Pill tone="ok">OK</Pill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
        <Panel title="Open part requests" meta={`${pendingRequests.length} pending`}>
          {pendingRequests.length === 0 ? (
            <div className="px-3 py-4 font-mono text-[11px] text-muted">All requested parts issued.</div>
          ) : (
            <ul className="divide-y divide-line">
              {pendingRequests.map((r, i) => (
                <li key={i} className="px-3 py-2.5">
                  <div className="font-mono text-[10px] text-accent">{r.job}</div>
                  <div className="text-xs font-medium">{r.name}</div>
                  <div className="font-mono text-[10px] text-muted">
                    {r.sku} · qty {r.qty} · {money(r.qty * r.unitPrice)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
