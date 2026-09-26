export const STAGES = [
  "Intake",
  "Estimate",
  "Approved",
  "In Progress",
  "QC",
  "Ready",
  "Delivered",
] as const;

export type Stage = (typeof STAGES)[number];

export type Technician = {
  id: string;
  name: string;
  initials: string;
  role: string;
  skills: string[];
  shift: string;
  utilisation: number;
  tone: "accent" | "info" | "warn" | "ok";
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: "Retail" | "Fleet" | "Insurance";
  since: string;
  vehicles: string[];
  outstanding: number;
};

export type Vehicle = {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  odometer: number;
  customerId: string;
  lastService: string;
};

export type Part = {
  id: string;
  sku: string;
  name: string;
  category: string;
  bin: string;
  stock: number;
  reorder: number;
  unitPrice: number;
};

export type JobPart = { sku: string; name: string; qty: number; unitPrice: number; issued: boolean };
export type JobTask = {
  id: string;
  name: string;
  techId: string;
  hours: number;
  rate: number;
  status: "Pending" | "Running" | "Paused" | "Done";
};
export type QcItem = { id: string; label: string; passed: boolean };
export type TimelineEvent = { at: string; label: string; by: string };

export type Job = {
  id: string;
  vehicleId: string;
  customerId: string;
  bay: string;
  stage: Stage;
  priority: "Normal" | "High" | "Urgent";
  serviceType: string;
  complaint: string;
  promised: string;
  insurance?: { insurer: string; claimNo: string; approved: number };
  tasks: JobTask[];
  parts: JobPart[];
  qc: QcItem[];
  timeline: TimelineEvent[];
  estimateApproved: boolean;
  paid: boolean;
  gatePass: boolean;
};

export const technicians: Technician[] = [
  { id: "T1", name: "Manish Kale", initials: "MK", role: "Lead Technician", skills: ["Engine", "Diagnostics"], shift: "Day 07:00–15:00", utilisation: 86, tone: "accent" },
  { id: "T2", name: "Jaya Lal", initials: "JL", role: "Technician", skills: ["Brakes", "Suspension"], shift: "Day 07:00–15:00", utilisation: 74, tone: "info" },
  { id: "T3", name: "Ravi Bhatt", initials: "RB", role: "Body & Paint", skills: ["Denting", "Painting"], shift: "Day 09:00–17:00", utilisation: 62, tone: "warn" },
  { id: "T4", name: "Sana Qureshi", initials: "SQ", role: "QC Inspector", skills: ["QC", "Road test"], shift: "Day 08:00–16:00", utilisation: 51, tone: "ok" },
];

export const customers: Customer[] = [
  { id: "C1", name: "D. Alvarez", phone: "+91 98200 11234", email: "d.alvarez@mail.com", type: "Retail", since: "2021", vehicles: ["V1"], outstanding: 0 },
  { id: "C2", name: "K. Osei", phone: "+91 98200 55871", email: "k.osei@mail.com", type: "Retail", since: "2019", vehicles: ["V2"], outstanding: 1340 },
  { id: "C3", name: "P. Novak", phone: "+91 98200 33420", email: "p.novak@mail.com", type: "Fleet", since: "2020", vehicles: ["V3", "V6"], outstanding: 410 },
  { id: "C4", name: "R. Haddad", phone: "+91 98200 71190", email: "r.haddad@mail.com", type: "Retail", since: "2023", vehicles: ["V4"], outstanding: 0 },
  { id: "C5", name: "L. Ferreira", phone: "+91 98200 90014", email: "l.ferreira@mail.com", type: "Insurance", since: "2018", vehicles: ["V5"], outstanding: 980 },
  { id: "C6", name: "S. Kim", phone: "+91 98200 42277", email: "s.kim@mail.com", type: "Fleet", since: "2022", vehicles: ["V7"], outstanding: 0 },
];

export const vehicles: Vehicle[] = [
  { id: "V1", plate: "7KLM209", make: "Ford", model: "F-150", year: 2019, vin: "1FTEW1E5XKF", odometer: 84210, customerId: "C1", lastService: "2026-05-14" },
  { id: "V2", plate: "5BQZ034", make: "Subaru", model: "WRX", year: 2021, vin: "JF1VA1A63M9", odometer: 41220, customerId: "C2", lastService: "2026-07-02" },
  { id: "V3", plate: "3WFL440", make: "Mazda", model: "CX-5", year: 2020, vin: "JM3KFBDM1L0", odometer: 63110, customerId: "C3", lastService: "2026-03-28" },
  { id: "V4", plate: "1RDS778", make: "Honda", model: "Civic", year: 2022, vin: "2HGFE2F58NH", odometer: 27890, customerId: "C4", lastService: "2026-08-19" },
  { id: "V5", plate: "2GHY556", make: "Audi", model: "A4", year: 2019, vin: "WAUZZZ8K2KA", odometer: 72040, customerId: "C5", lastService: "2026-01-11" },
  { id: "V6", plate: "8NPT612", make: "Toyota", model: "Tacoma", year: 2018, vin: "3TMCZ5AN2JM", odometer: 105330, customerId: "C3", lastService: "2026-06-06" },
  { id: "V7", plate: "6HMC905", make: "Jeep", model: "Wrangler", year: 2020, vin: "1C4HJXDG1LW", odometer: 58400, customerId: "C6", lastService: "2026-09-01" },
  { id: "V8", plate: "4TRV881", make: "VW", model: "Golf GTI", year: 2023, vin: "WVWZZZAUZPW", odometer: 12040, customerId: "C1", lastService: "2026-09-20" },
  { id: "V9", plate: "9XKD117", make: "BMW", model: "330i", year: 2021, vin: "WBA5R1C05MF", odometer: 38900, customerId: "C4", lastService: "2026-04-17" },
];

export const parts: Part[] = [
  { id: "P1", sku: "PRT-2210", name: "Front brake pad set", category: "Brakes", bin: "A-04", stock: 18, reorder: 8, unitPrice: 92 },
  { id: "P2", sku: "PRT-0094", name: "Cabin air filter", category: "Filters", bin: "B-11", stock: 6, reorder: 10, unitPrice: 21 },
  { id: "P3", sku: "PRT-0007", name: "Engine oil 5W-30 (1L)", category: "Lubricants", bin: "C-02", stock: 64, reorder: 24, unitPrice: 14 },
  { id: "P4", sku: "PRT-1180", name: "Brake disc rotor", category: "Brakes", bin: "A-06", stock: 4, reorder: 6, unitPrice: 138 },
  { id: "P5", sku: "PRT-3301", name: "Clear coat 1K aerosol", category: "Paint", bin: "P-01", stock: 22, reorder: 10, unitPrice: 33 },
  { id: "P6", sku: "PRT-5002", name: "Battery 12V 60Ah", category: "Electrical", bin: "D-08", stock: 3, reorder: 4, unitPrice: 176 },
  { id: "P7", sku: "PRT-0450", name: "Wiper blade pair", category: "Consumables", bin: "B-02", stock: 31, reorder: 12, unitPrice: 26 },
];

export const jobs: Job[] = [
  {
    id: "JOB-0851",
    vehicleId: "V8",
    customerId: "C1",
    bay: "Bay 5",
    stage: "Intake",
    priority: "Normal",
    serviceType: "Periodic service",
    complaint: "Due for 20,000 km service; slight rattle over bumps.",
    promised: "Today 17:30",
    tasks: [{ id: "K1", name: "Intake inspection", techId: "T2", hours: 0.5, rate: 60, status: "Running" }],
    parts: [],
    qc: [],
    timeline: [{ at: "08:05", label: "Vehicle arrived, gate entry logged", by: "Gate Security" }],
    estimateApproved: false,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0852",
    vehicleId: "V9",
    customerId: "C4",
    bay: "Bay 7",
    stage: "Intake",
    priority: "High",
    serviceType: "Diagnostics",
    complaint: "Check-engine light on since yesterday.",
    promised: "Tomorrow 12:00",
    tasks: [{ id: "K2", name: "Scan tool diagnostics", techId: "T1", hours: 1, rate: 75, status: "Pending" }],
    parts: [],
    qc: [],
    timeline: [{ at: "08:40", label: "Walk-in registered by advisor", by: "Service Advisor" }],
    estimateApproved: false,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0847",
    vehicleId: "V1",
    customerId: "C1",
    bay: "Bay 3",
    stage: "Estimate",
    priority: "Normal",
    serviceType: "Brake overhaul",
    complaint: "Grinding noise while braking, pedal vibration.",
    promised: "Today 18:00",
    tasks: [
      { id: "K3", name: "Front brake service", techId: "T2", hours: 2.5, rate: 60, status: "Pending" },
      { id: "K4", name: "Rotor resurfacing", techId: "T2", hours: 1, rate: 60, status: "Pending" },
    ],
    parts: [
      { sku: "PRT-2210", name: "Front brake pad set", qty: 1, unitPrice: 92, issued: false },
      { sku: "PRT-1180", name: "Brake disc rotor", qty: 2, unitPrice: 138, issued: false },
    ],
    qc: [],
    timeline: [
      { at: "07:20", label: "Intake logged with condition photos", by: "Gate Security" },
      { at: "08:55", label: "Estimate v1 sent to customer", by: "Service Advisor" },
    ],
    estimateApproved: false,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0844",
    vehicleId: "V5",
    customerId: "C5",
    bay: "Bay 2",
    stage: "Approved",
    priority: "High",
    serviceType: "Accident repair",
    complaint: "Rear quarter panel damage from parking collision.",
    promised: "Mon 15:00",
    insurance: { insurer: "Northbridge General", claimNo: "NB-2026-88142", approved: 880 },
    tasks: [
      { id: "K5", name: "Panel beating", techId: "T3", hours: 5, rate: 70, status: "Pending" },
      { id: "K6", name: "Paint & clear coat", techId: "T3", hours: 3, rate: 70, status: "Pending" },
    ],
    parts: [{ sku: "PRT-3301", name: "Clear coat 1K aerosol", qty: 3, unitPrice: 33, issued: false }],
    qc: [],
    timeline: [
      { at: "Mon 09:10", label: "Claim registered with insurer", by: "Insurance Desk" },
      { at: "Tue 11:40", label: "Surveyor approved INR-equivalent 880", by: "Surveyor" },
    ],
    estimateApproved: true,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0839",
    vehicleId: "V2",
    customerId: "C2",
    bay: "Bay 1",
    stage: "In Progress",
    priority: "Urgent",
    serviceType: "Brake + service",
    complaint: "Brake fade under load, service overdue.",
    promised: "Today 16:00",
    tasks: [
      { id: "K7", name: "Brake pad replacement", techId: "T1", hours: 2, rate: 75, status: "Running" },
      { id: "K8", name: "Oil & filter change", techId: "T2", hours: 1, rate: 60, status: "Done" },
    ],
    parts: [
      { sku: "PRT-2210", name: "Front brake pad set", qty: 1, unitPrice: 92, issued: true },
      { sku: "PRT-0007", name: "Engine oil 5W-30 (1L)", qty: 5, unitPrice: 14, issued: true },
    ],
    qc: [],
    timeline: [
      { at: "07:45", label: "Job card opened from approved estimate", by: "Workshop Manager" },
      { at: "09:30", label: "Parts issued from store", by: "Store Keeper" },
      { at: "10:15", label: "Brake task started", by: "Manish Kale" },
    ],
    estimateApproved: true,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0841",
    vehicleId: "V6",
    customerId: "C3",
    bay: "Bay 4",
    stage: "In Progress",
    priority: "Normal",
    serviceType: "Electrical",
    complaint: "Battery drains overnight.",
    promised: "Tomorrow 11:00",
    tasks: [{ id: "K9", name: "Parasitic draw test + battery swap", techId: "T3", hours: 2, rate: 70, status: "Paused" }],
    parts: [{ sku: "PRT-5002", name: "Battery 12V 60Ah", qty: 1, unitPrice: 176, issued: true }],
    qc: [],
    timeline: [
      { at: "08:20", label: "Job card opened", by: "Workshop Manager" },
      { at: "11:05", label: "Task paused — awaiting customer callback", by: "Ravi Bhatt" },
    ],
    estimateApproved: true,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0833",
    vehicleId: "V3",
    customerId: "C3",
    bay: "Bay 6",
    stage: "QC",
    priority: "Normal",
    serviceType: "Periodic service",
    complaint: "Routine 60,000 km service.",
    promised: "Today 14:00",
    tasks: [{ id: "K10", name: "60k service package", techId: "T1", hours: 3, rate: 75, status: "Done" }],
    parts: [
      { sku: "PRT-0094", name: "Cabin air filter", qty: 1, unitPrice: 21, issued: true },
      { sku: "PRT-0007", name: "Engine oil 5W-30 (1L)", qty: 4, unitPrice: 14, issued: true },
    ],
    qc: [
      { id: "Q1", label: "Fluid levels and leak check", passed: true },
      { id: "Q2", label: "Road test 5 km", passed: true },
      { id: "Q3", label: "Torque check on wheels", passed: false },
      { id: "Q4", label: "Interior cleanliness", passed: false },
    ],
    timeline: [
      { at: "07:10", label: "Job card opened", by: "Workshop Manager" },
      { at: "12:40", label: "Work completed, sent to QC", by: "Manish Kale" },
    ],
    estimateApproved: true,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0828",
    vehicleId: "V4",
    customerId: "C4",
    bay: "Bay 8",
    stage: "Ready",
    priority: "Normal",
    serviceType: "Wash + minor repair",
    complaint: "Wiper replacement and full wash.",
    promised: "Today 13:00",
    tasks: [{ id: "K11", name: "Wiper replacement", techId: "T2", hours: 0.5, rate: 60, status: "Done" }],
    parts: [{ sku: "PRT-0450", name: "Wiper blade pair", qty: 1, unitPrice: 26, issued: true }],
    qc: [
      { id: "Q5", label: "Wiper sweep test", passed: true },
      { id: "Q6", label: "Wash and final visual check", passed: true },
    ],
    timeline: [
      { at: "09:00", label: "Job card opened", by: "Service Advisor" },
      { at: "11:20", label: "QC passed", by: "Sana Qureshi" },
      { at: "11:45", label: "Invoice generated", by: "Cashier" },
    ],
    estimateApproved: true,
    paid: false,
    gatePass: false,
  },
  {
    id: "JOB-0819",
    vehicleId: "V7",
    customerId: "C6",
    bay: "—",
    stage: "Delivered",
    priority: "Normal",
    serviceType: "Major repair",
    complaint: "Clutch replacement.",
    promised: "Yesterday 17:00",
    tasks: [{ id: "K12", name: "Clutch assembly replacement", techId: "T1", hours: 8, rate: 75, status: "Done" }],
    parts: [{ sku: "PRT-0007", name: "Engine oil 5W-30 (1L)", qty: 3, unitPrice: 14, issued: true }],
    qc: [
      { id: "Q7", label: "Clutch engagement road test", passed: true },
      { id: "Q8", label: "Leak check", passed: true },
    ],
    timeline: [
      { at: "Mon 08:00", label: "Job card opened", by: "Workshop Manager" },
      { at: "Tue 16:10", label: "QC passed", by: "Sana Qureshi" },
      { at: "Tue 17:05", label: "Payment received, gate pass issued", by: "Cashier" },
    ],
    estimateApproved: true,
    paid: true,
    gatePass: true,
  },
];

export const TAX_RATE = 0.18;

export function jobLabour(job: Job) {
  return job.tasks.reduce((s, t) => s + t.hours * t.rate, 0);
}
export function jobPartsTotal(job: Job) {
  return job.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
}
export function jobSubtotal(job: Job) {
  return jobLabour(job) + jobPartsTotal(job);
}
export function jobTotal(job: Job) {
  return Math.round(jobSubtotal(job) * (1 + TAX_RATE));
}
export function money(n: number) {
  return "$" + n.toLocaleString("en-US");
}
