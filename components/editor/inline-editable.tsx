"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useEditorContext } from "@/contexts/editor-context";

interface InlineEditableProps {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function InlineEditable({
  value,
  onChange,
  multiline = false,
  as = "span",
  className,
  style,
}: InlineEditableProps) {
  const { isEditing } = useEditorContext();
  const ref = useRef<HTMLElement>(null);

  // Set initial content imperatively — avoids React's controlled contenteditable cursor issues
  useEffect(() => {
    if (ref.current) ref.current.textContent = value;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes (sidebar edits) only when this element is not focused
  useEffect(() => {
    if (
      ref.current &&
      document.activeElement !== ref.current &&
      ref.current.textContent !== value
    ) {
      ref.current.textContent = value;
    }
  }, [value]);

  if (!isEditing) {
    return React.createElement(as as string, { className, style }, value);
  }

  return React.createElement(as as string, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    title: "Click to edit",
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      onChange((e.currentTarget as HTMLElement).textContent ?? "");
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
      // Prevent keyboard shortcuts (delete, etc.) from triggering drag-and-drop handlers
      e.stopPropagation();
    },
    className: cn(
      "outline-none cursor-text rounded-[3px] transition-shadow",
      "ring-2 ring-transparent",
      "hover:ring-primary/30",
      "focus:ring-primary/50 focus:bg-black/[0.02] dark:focus:bg-white/[0.04]",
      className
    ),
    style,
  });
}
