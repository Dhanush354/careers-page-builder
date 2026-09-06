"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HiringStep } from "@/types/company";

export function HiringProcessStepsEditor({
  steps,
  onChange,
}: {
  steps: HiringStep[];
  onChange: (steps: HiringStep[]) => void;
}) {
  function addStep() {
    const id = `step-${Date.now()}`;
    onChange([...steps, { id, title: "", description: "", duration: "" }]);
  }

  function updateStep(index: number, patch: Partial<HiringStep>) {
    const next = steps.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange(next);
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
        Steps
      </p>
      {steps.map((step, i) => (
        <div
          key={step.id}
          className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Step {i + 1}</span>
            <button
              type="button"
              onClick={() => removeStep(i)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${step.id}-title`} className="text-xs">Title</Label>
            <Input
              id={`${step.id}-title`}
              maxLength={80}
              placeholder="e.g. Recruiter Screen"
              value={step.title}
              onChange={(e) => updateStep(i, { title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${step.id}-duration`} className="text-xs">Duration (optional)</Label>
            <Input
              id={`${step.id}-duration`}
              maxLength={40}
              placeholder="e.g. 30 min"
              value={step.duration}
              onChange={(e) => updateStep(i, { duration: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${step.id}-desc`} className="text-xs">Description</Label>
            <Textarea
              id={`${step.id}-desc`}
              maxLength={300}
              rows={2}
              value={step.description}
              onChange={(e) => updateStep(i, { description: e.target.value })}
            />
          </div>
        </div>
      ))}
      {steps.length < 8 && (
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          + Add Step
        </Button>
      )}
    </div>
  );
}
