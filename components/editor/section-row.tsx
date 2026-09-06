"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BlockContentEditor } from "@/components/editor/block-content-editor";
import { cn } from "@/lib/utils";
import { BLOCK_TYPE_LABELS } from "@/types/company";
import type { PageBlock } from "@/types/company";

export function SectionRow({
  block,
  dragHandleProps,
  isDragging,
  removable,
  visibilityLocked,
  onChange,
  onRemove,
}: {
  block: PageBlock;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  isDragging: boolean;
  removable: boolean;
  visibilityLocked: boolean;
  onChange: (block: PageBlock) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const label = BLOCK_TYPE_LABELS[block.type];
  const canExpand = true;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-colors",
        isDragging ? "border-ring bg-accent" : "border-border hover:border-foreground/20"
      )}
    >
      <div className="flex flex-wrap items-center gap-1 p-2.5 sm:gap-1.5">
        <button
          type="button"
          {...dragHandleProps}
          aria-label={`Drag to reorder ${label}`}
          title="Drag to reorder"
          className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>

        <span className="min-w-0 flex-1 truncate px-1 text-sm font-medium text-foreground">
          {label}
        </span>

        {visibilityLocked ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Required
          </span>
        ) : (
          <div className="flex items-center gap-1.5 px-1">
            {block.visible ? (
              <Eye className="size-3.5 text-muted-foreground" aria-hidden="true" />
            ) : (
              <EyeOff className="size-3.5 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {block.visible ? "Visible" : "Hidden"}
            </span>
            <Switch
              checked={block.visible}
              onCheckedChange={(checked) => onChange({ ...block, visible: checked })}
              aria-label={block.visible ? `Hide ${label} section` : `Show ${label} section`}
            />
          </div>
        )}

        {removable && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${label} section`}
                title="Remove section"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove {label} section?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the section from your careers page. You can
                  add it back later, but its content won&apos;t be restored.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {canExpand && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={expanded ? `Collapse ${label} section` : `Edit ${label} section`}
            aria-expanded={expanded}
            title={expanded ? "Collapse" : "Edit section"}
            onClick={() => setExpanded((value) => !value)}
          >
            <ChevronDown
              className={cn("size-4 transition-transform", expanded && "rotate-180")}
              aria-hidden="true"
            />
          </Button>
        )}
      </div>

      {expanded && canExpand && (
        <div className="border-t border-border bg-muted/30 p-3">
          <BlockContentEditor block={block} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
