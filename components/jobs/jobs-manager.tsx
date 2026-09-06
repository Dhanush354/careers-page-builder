"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobFormDialog } from "@/components/jobs/job-form-dialog";
import { deleteJob, toggleJobActive } from "@/lib/jobs/actions";
import { seedSampleJobs } from "@/lib/jobs/seed";
import type { Job } from "@/types/job";

// ── palette ────────────────────────────────────────────────────────────────
const PALETTES = [
  "#6366f1","#f59e0b","#10b981","#ef4444",
  "#8b5cf6","#06b6d4","#f97316","#ec4899",
  "#14b8a6","#84cc16",
];
const getColor = (s: string) => PALETTES[s.charCodeAt(0) % PALETTES.length];

function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── chip ───────────────────────────────────────────────────────────────────
function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: hexAlpha(color, 0.15), color }}
    >
      {children}
    </span>
  );
}

// ── card ───────────────────────────────────────────────────────────────────
function JobCard({
  job, onEdit, onToggle, onDelete,
}: {
  job: Job; onEdit(): void; onToggle(): void; onDelete(): void;
}) {
  const color = getColor(job.title);
  const initial = job.title.trim()[0]?.toUpperCase() ?? "J";
  const tags = [job.work_policy, job.employment_type].filter(Boolean);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: hexAlpha(color, 0.08),
        boxShadow: `0 0 0 1px ${hexAlpha(color, 0.18)}, 0 1px 3px 0 rgba(0,0,0,0.04)`,
      }}
    >
      {/* Hover actions */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end gap-0.5 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={onToggle} title={job.is_active ? "Deactivate" : "Activate"}
          className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-muted-foreground backdrop-blur-sm hover:text-foreground dark:bg-black/50">
          {job.is_active ? <ToggleRight className="h-3.5 w-3.5 text-emerald-500" /> : <ToggleLeft className="h-3.5 w-3.5" />}
        </button>
        <button onClick={onEdit} title="Edit"
          className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-muted-foreground backdrop-blur-sm hover:text-foreground dark:bg-black/50">
          <Pencil className="h-3 w-3" />
        </button>
        <button onClick={onDelete} title="Delete"
          className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-muted-foreground backdrop-blur-sm hover:text-destructive dark:bg-black/50">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color }}>
            {job.department ?? "General"}
          </span>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ backgroundColor: color, boxShadow: `0 0 0 2px ${hexAlpha(color, 0.2)}` }}
          >
            {initial}
          </div>
        </div>

        <h3 className="mt-2 text-[13px] font-bold leading-snug tracking-tight text-foreground">
          {job.title}
        </h3>
        {job.experience_level && (
          <p className="mt-0.5 text-[11px] text-muted-foreground/60">{job.experience_level}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((t) => <Chip key={t} color={color}>{t}</Chip>)}
          </div>
        )}

        {job.salary_range && (
          <p className="mt-1.5 text-[11px] font-bold" style={{ color }}>{job.salary_range}</p>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${hexAlpha(color, 0.18)}` }} />

      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {job.location
            ? <><MapPin className="h-2.5 w-2.5 shrink-0" style={{ color }} /><span className="max-w-[90px] truncate">{job.location}</span></>
            : <span className="text-muted-foreground/30">No location</span>}
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {job.is_active ? "Active" : "Inactive"}
          <span className={`h-1.5 w-1.5 rounded-full ${job.is_active ? "bg-white/80" : "bg-white/40"}`} />
        </div>
      </div>
    </div>
  );
}

// ── table view ─────────────────────────────────────────────────────────────
function JobsTable({
  jobs, onEdit, onToggle, onDelete,
}: {
  jobs: Job[]; onEdit(j: Job): void; onToggle(j: Job): void; onDelete(j: Job): void;
}) {
  return (
    <div className="zk-card overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-black/[0.05] dark:border-white/[0.05]">
            {["Role", "Department", "Location", "Type", "Policy", "Status", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => {
            const color = getColor(job.title);
            return (
              <tr
                key={job.id}
                className={`group transition-colors hover:bg-muted/30 ${i < jobs.length - 1 ? "border-b border-black/[0.04] dark:border-white/[0.04]" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {job.title[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground">{job.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{job.department ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.location ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.employment_type ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.work_policy ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    job.is_active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground/50"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${job.is_active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={() => onToggle(job)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                      {job.is_active ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <button onClick={() => onEdit(job)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onDelete(job)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── left panel dept item ───────────────────────────────────────────────────
function DeptItem({
  dept, jobs, selected, onSelect,
}: { dept: string; jobs: Job[]; selected: boolean; onSelect(d: string | null): void }) {
  const [open, setOpen] = useState(selected);
  const color = getColor(dept);

  return (
    <div>
      <button
        type="button"
        onClick={() => { setOpen(!open); onSelect(selected ? null : dept); }}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors"
        style={selected ? { backgroundColor: hexAlpha(color, 0.12), color } : undefined}
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
        <span className={`flex-1 truncate ${selected ? "" : "text-muted-foreground"}`}>{dept}</span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: hexAlpha(color, 0.15), color }}
        >
          {jobs.length}
        </span>
      </button>
      {open && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center gap-2 py-0.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="truncate text-[12px] text-muted-foreground">{j.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── empty state ────────────────────────────────────────────────────────────
function EmptyState({ onAdd, onSeed }: { onAdd(): void; onSeed(): void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Briefcase className="h-7 w-7 text-primary" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">No job postings yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Add your first role or load sample data to get started.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onAdd}><Plus className="mr-1.5 h-4 w-4" /> Add Job</Button>
        <Button size="sm" variant="outline" onClick={onSeed}><Sparkles className="mr-1.5 h-4 w-4" /> Load Sample Jobs</Button>
      </div>
    </div>
  );
}

// ── main ───────────────────────────────────────────────────────────────────
export function JobsManager({ jobs: initialJobs }: { jobs: Job[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [optimisticJobs, setOptimisticJobs] = useOptimistic(initialJobs);
  const [, startTransition] = useTransition();

  const deptMap = useMemo(() => {
    const m = new Map<string, Job[]>();
    for (const j of optimisticJobs) {
      const key = j.department ?? "General";
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(j);
    }
    return m;
  }, [optimisticJobs]);

  const policies = useMemo(
    () => [...new Set(optimisticJobs.map((j) => j.work_policy).filter(Boolean) as string[])],
    [optimisticJobs]
  );

  const filtered = useMemo(
    () => optimisticJobs.filter((j) => {
      if (selectedDept && (j.department ?? "General") !== selectedDept) return false;
      if (selectedPolicy && j.work_policy !== selectedPolicy) return false;
      return true;
    }),
    [optimisticJobs, selectedDept, selectedPolicy]
  );

  const activeCount = filtered.filter((j) => j.is_active).length;

  function openAdd() { setEditingJob(null); setDialogOpen(true); }
  function openEdit(job: Job) { setEditingJob(job); setDialogOpen(true); }

  async function handleSeed() {
    setSeeding(true);
    await seedSampleJobs();
    setSeeding(false);
  }

  function handleToggle(job: Job) {
    const next = !job.is_active;
    startTransition(async () => {
      setOptimisticJobs((p) => p.map((j) => j.id === job.id ? { ...j, is_active: next } : j));
      await toggleJobActive(job.id, next);
    });
  }

  function handleDelete(job: Job) {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      setOptimisticJobs((p) => p.filter((j) => j.id !== job.id));
      await deleteJob(job.id);
    });
  }

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">Jobs</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Job Postings</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {optimisticJobs.length} role{optimisticJobs.length !== 1 ? "s" : ""} · {optimisticJobs.filter((j) => j.is_active).length} active
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleSeed} disabled={seeding}>
            <Sparkles className="mr-1.5 h-4 w-4" />
            {seeding ? "Loading…" : "Sample Jobs"}
          </Button>
          <Button size="sm" onClick={openAdd}><Plus className="mr-1.5 h-4 w-4" /> Add Job</Button>
        </div>
      </div>

      {optimisticJobs.length === 0 ? (
        <EmptyState onAdd={openAdd} onSeed={handleSeed} />
      ) : (
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* ── Left panel ─────────────────────────────────────── */}
          <aside className="lg:w-52 lg:shrink-0">
            <div className="rounded-xl bg-foreground p-4 text-background">
              <p className="text-[13px] font-bold">
                {optimisticJobs.length} Open Role{optimisticJobs.length !== 1 ? "s" : ""}
              </p>
              <p className="mt-1 text-[11px] leading-snug opacity-50">
                Pick a department — hover cards to edit or delete.
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Subjects
              </p>
              <div className="space-y-0.5">
                {[...deptMap.entries()].map(([dept, jobs]) => (
                  <DeptItem
                    key={dept}
                    dept={dept}
                    jobs={jobs}
                    selected={selectedDept === dept}
                    onSelect={(d) => setSelectedDept(d)}
                  />
                ))}
              </div>
            </div>

            {policies.length > 0 && (
              <div className="mt-5">
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  Work Policy
                </p>
                <div className="space-y-0.5">
                  {policies.map((p) => {
                    const color = getColor(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPolicy(selectedPolicy === p ? null : p)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors"
                        style={selectedPolicy === p ? { backgroundColor: hexAlpha(color, 0.12), color } : undefined}
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full border-2"
                          style={selectedPolicy === p
                            ? { borderColor: color, backgroundColor: color }
                            : { borderColor: "rgba(150,150,150,0.3)" }}
                        />
                        <span className={selectedPolicy === p ? "font-semibold" : "text-muted-foreground"}>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* ── Right panel ────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{selectedDept ?? "All Roles"}</h2>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                  {filtered.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] text-muted-foreground">
                  {activeCount} active · {filtered.length - activeCount} inactive
                </span>
                <div className="flex items-center rounded-lg border border-black/[0.06] bg-muted/40 p-0.5 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
                      view === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("table")}
                    className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
                      view === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-sm font-medium text-foreground">No roles match this filter</p>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => { setSelectedDept(null); setSelectedPolicy(null); }}
                >
                  Clear filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={() => openEdit(job)}
                    onToggle={() => handleToggle(job)}
                    onDelete={() => handleDelete(job)}
                  />
                ))}
              </div>
            ) : (
              <JobsTable
                jobs={filtered}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      )}

      <JobFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        job={editingJob}
      />
    </>
  );
}
