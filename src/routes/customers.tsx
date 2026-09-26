import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Panel, Pill } from "@/components/ops";
import { customers, money, vehicles } from "@/lib/garage-data";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — AxleOS" },
      { name: "description", content: "Retail, fleet and insurance customers with vehicles and balances." },
      { property: "og:title", content: "Customers — AxleOS" },
      { property: "og:description", content: "Retail, fleet and insurance customers with vehicles and balances." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <AppShell>
      <PageTitle title="CUSTOMERS" meta={`${customers.length} records`} />
      <div className="px-6 py-3 pb-8">
        <Panel title="Customer master" meta="CRM">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-muted uppercase text-[10px] bg-surface/60">
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Phone</th>
                <th className="text-left px-3 py-2">Email</th>
                <th className="text-left px-3 py-2">Vehicles</th>
                <th className="text-left px-3 py-2">Since</th>
                <th className="text-right px-3 py-2">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-line hover:bg-surface2/60">
                  <td className="px-3 py-2 font-body font-medium">{c.name}</td>
                  <td className="px-3 py-2">
                    <Pill tone={c.type === "Fleet" ? "info" : c.type === "Insurance" ? "warn" : "muted"}>
                      {c.type}
                    </Pill>
                  </td>
                  <td className="px-3 py-2 text-muted">{c.phone}</td>
                  <td className="px-3 py-2 text-muted">{c.email}</td>
                  <td className="px-3 py-2">
                    {c.vehicles
                      .map((id) => vehicles.find((v) => v.id === id)?.plate)
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td className="px-3 py-2 text-muted">{c.since}</td>
                  <td className={`px-3 py-2 text-right ${c.outstanding > 0 ? "text-warn" : "text-muted"}`}>
                    {money(c.outstanding)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AppShell>
  );
}
