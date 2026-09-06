"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy link"}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-background hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span className="sr-only">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
