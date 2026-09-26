import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageTitle, Panel, StagePill } from "@/components/ops";
import { useGarage } from "@/lib/garage-store";
import { customers, vehicles } from "@/lib/garage-data";

export const Route = createFileRoute("/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — AxleOS" },
      { name: "description", content: "Vehicle master with plate, VIN, odometer and current workshop job." },
      { property: "og:title", content: "Vehicles — AxleOS" },
      { property: "og:description", content: "Vehicle master with plate, VIN, odometer and current workshop job." },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const { jobs } = useGarage();

  return (
    <AppShell>
      <PageTitle title="VEHICLES" meta={`${vehicles.length} registered`} />
      <div className="px-6 py-3 pb-8">
        <Panel title="Vehicle master" meta="Plate / VIN">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-muted uppercase text-[10px] bg-surface/60">
                <th className="text-left px-3 py-2">Plate</th>
                <th className="text-left px-3 py-2">Vehicle</th>
                <th className="text-left px-3 py-2">VIN</th>
                <th className="text-left px-3 py-2">Owner</th>
                <th className="text-right px-3 py-2">Odometer</th>
                <th className="text-left px-3 py-2 pl-5">Last service</th>
                <th className="text-left px-3 py-2">Current job</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const job = jobs.find((j) => j.vehicleId === v.id && j.stage !== "Delivered");
                const owner = customers.find((c) => c.id === v.customerId);
                return (
                  <tr key={v.id} className="border-t border-line hover:bg-surface2/60">
                    <td className="px-3 py-2 text-accent">{v.plate}</td>
                    <td className="px-3 py-2 font-body font-medium">
                      {v.year} {v.make} {v.model}
                    </td>
                    <td className="px-3 py-2 text-muted">{v.vin}</td>
                    <td className="px-3 py-2 font-body text-muted">{owner?.name}</td>
                    <td className="px-3 py-2 text-right">{v.odometer.toLocaleString()} km</td>
                    <td className="px-3 py-2 pl-5 text-muted">{v.lastService}</td>
                    <td className="px-3 py-2">
                      {job ? (
                        <span className="inline-flex items-center gap-2">
                          <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="text-accent">
                            {job.id}
                          </Link>
                          <StagePill stage={job.stage} />
                        </span>
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
      </div>
    </AppShell>
  );
}
