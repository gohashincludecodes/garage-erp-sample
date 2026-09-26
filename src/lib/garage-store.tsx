import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  jobs as seedJobs,
  parts as seedParts,
  STAGES,
  type Job,
  type Part,
  type Stage,
} from "./garage-data";

type Ctx = {
  jobs: Job[];
  parts: Part[];
  advance: (jobId: string) => void;
  approveEstimate: (jobId: string) => void;
  setTaskStatus: (jobId: string, taskId: string, status: Job["tasks"][number]["status"]) => void;
  issuePart: (jobId: string, sku: string) => void;
  toggleQc: (jobId: string, qcId: string) => void;
  markPaid: (jobId: string) => void;
  issueGatePass: (jobId: string) => void;
};

const GarageContext = createContext<Ctx | null>(null);

function stamp() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function GarageProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [parts, setParts] = useState<Part[]>(seedParts);

  const patch = (jobId: string, fn: (j: Job) => Job) =>
    setJobs((all) => all.map((j) => (j.id === jobId ? fn(j) : j)));

  const log = (j: Job, label: string, by: string): Job => ({
    ...j,
    timeline: [...j.timeline, { at: stamp(), label, by }],
  });

  const value = useMemo<Ctx>(
    () => ({
      jobs,
      parts,
      advance: (jobId) =>
        patch(jobId, (j) => {
          const i = STAGES.indexOf(j.stage);
          if (i === STAGES.length - 1) return j;
          const next = STAGES[i + 1] as Stage;
          const moved: Job = {
            ...j,
            stage: next,
            bay: next === "Delivered" ? "—" : j.bay,
            estimateApproved: j.estimateApproved || STAGES.indexOf(next) >= 2,
          };
          return log(moved, `Stage moved to ${next}`, "Workshop Manager");
        }),
      approveEstimate: (jobId) =>
        patch(jobId, (j) =>
          log({ ...j, estimateApproved: true }, "Estimate approved by customer", "Service Advisor"),
        ),
      setTaskStatus: (jobId, taskId, status) =>
        patch(jobId, (j) =>
          log(
            { ...j, tasks: j.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) },
            `Task ${j.tasks.find((t) => t.id === taskId)?.name} → ${status}`,
            "Technician",
          ),
        ),
      issuePart: (jobId, sku) => {
        setParts((all) => all.map((p) => (p.sku === sku ? { ...p, stock: Math.max(0, p.stock - 1) } : p)));
        patch(jobId, (j) =>
          log(
            { ...j, parts: j.parts.map((p) => (p.sku === sku ? { ...p, issued: true } : p)) },
            `Part ${sku} issued from store`,
            "Store Keeper",
          ),
        );
      },
      toggleQc: (jobId, qcId) =>
        patch(jobId, (j) => ({
          ...j,
          qc: j.qc.map((q) => (q.id === qcId ? { ...q, passed: !q.passed } : q)),
        })),
      markPaid: (jobId) => patch(jobId, (j) => log({ ...j, paid: true }, "Payment received", "Cashier")),
      issueGatePass: (jobId) =>
        patch(jobId, (j) => log({ ...j, gatePass: true }, "Gate pass issued", "Gate Security")),
    }),
    [jobs, parts],
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error("useGarage must be used inside GarageProvider");
  return ctx;
}
