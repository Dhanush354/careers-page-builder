"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BLOCK_TYPE_LABELS } from "@/types/company";
import type { PageBlockType } from "@/types/company";

const BLOCK_TYPE_DESCRIPTIONS: Partial<Record<PageBlockType, string>> = {
  about: "Company introduction",
  life: "Describe culture and work environment",
  benefits: "Health, PTO, remote, learning budget and other perks",
  values: "Core principles that define how your team works",
  hiringProcess: "Step-by-step walkthrough of your interview process",
  stats: "Highlight company numbers",
  testimonials: "Employee quotes from your team",
  ctaBanner: "Bold call-to-action with a link to open roles",
  faq: "Answer common candidate questions",
  footer: "Social links, tagline, and equal opportunity statement",
};

export function AddSectionDialog({
  availableTypes,
  onAdd,
}: {
  availableTypes: PageBlockType[];
  onAdd: (type: PageBlockType) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleAdd(type: PageBlockType) {
    onAdd(type);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={availableTypes.length === 0}
        >
          + Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a section</DialogTitle>
          <DialogDescription>
            {availableTypes.length > 0
              ? "Choose a section type to add to your careers page."
              : "All available sections have already been added."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAdd(type)}
              className="flex flex-col gap-0.5 rounded-lg border border-border p-3 text-left transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-sm font-medium text-foreground">
                {BLOCK_TYPE_LABELS[type]}
              </span>
              {BLOCK_TYPE_DESCRIPTIONS[type] && (
                <span className="text-xs text-muted-foreground">
                  {BLOCK_TYPE_DESCRIPTIONS[type]}
                </span>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
