"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createJob, updateJob, type JobFormState } from "@/lib/jobs/actions";
import type { Job } from "@/types/job";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const WORK_POLICIES = ["Remote", "Hybrid", "On-site"];
const EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead", "Manager", "Director"];

const INITIAL: JobFormState = { error: null, success: false };

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[12px] font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function Input({ name, defaultValue, placeholder, required }: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-black/[0.1] bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/[0.1]"
    />
  );
}

function Select({ name, defaultValue, options }: {
  name: string;
  defaultValue?: string | null;
  options: string[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      className="w-full rounded-lg border border-black/[0.1] bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/[0.1]"
    >
      <option value="">— Select —</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export function JobFormDialog({
  open,
  onClose,
  job,
}: {
  open: boolean;
  onClose: () => void;
  job?: Job | null;
}) {
  const isEdit = !!job;
  const action = isEdit ? updateJob : createJob;
  const [state, dispatch, isPending] = useActionState(action, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      onClose();
      formRef.current?.reset();
    }
  }, [state.success, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {isEdit ? "Edit Job" : "Add New Job"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={dispatch} className="mt-2 space-y-4">
          {isEdit && <input type="hidden" name="id" value={job.id} />}

          <FieldGroup label="Job Title *">
            <Input name="title" defaultValue={job?.title} placeholder="e.g. Senior Frontend Engineer" required />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Department">
              <Input name="department" defaultValue={job?.department} placeholder="e.g. Engineering" />
            </FieldGroup>
            <FieldGroup label="Location">
              <Input name="location" defaultValue={job?.location} placeholder="e.g. Remote / NYC" />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Employment Type">
              <Select name="employment_type" defaultValue={job?.employment_type} options={EMPLOYMENT_TYPES} />
            </FieldGroup>
            <FieldGroup label="Work Policy">
              <Select name="work_policy" defaultValue={job?.work_policy} options={WORK_POLICIES} />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Experience Level">
              <Select name="experience_level" defaultValue={job?.experience_level} options={EXPERIENCE_LEVELS} />
            </FieldGroup>
            <FieldGroup label="Salary Range">
              <Input name="salary_range" defaultValue={job?.salary_range} placeholder="e.g. $80k–$100k" />
            </FieldGroup>
          </div>

          {state.error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
