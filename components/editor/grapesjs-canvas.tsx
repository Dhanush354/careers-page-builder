"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Monitor,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { saveGrapejsData, publishGrapejsPage } from "@/lib/editor/grapesjs-actions";
import { buildCareerBlocks } from "@/lib/editor/grapesjs-blocks";
import { uploadToCloudinary } from "@/lib/editor/cloudinary-upload";
import { buildCanvasCSS } from "@/lib/editor/grapesjs-styles";
import { buildGjsUITheme } from "@/lib/editor/grapesjs-ui-theme";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";

// GrapeJS CSS — only loads when the builder route is used (namespaced .gjs-*)
import "grapesjs/dist/css/grapes.min.css";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type PubStatus  = "idle" | "publishing" | "published";
type DeviceName = "Desktop" | "Tablet" | "Mobile";

const DEVICES: { name: DeviceName; gjsName: string; icon: React.ReactNode; label: string }[] = [
  { name: "Mobile",   gjsName: "Mobile portrait", icon: <Smartphone className="h-3.5 w-3.5" />, label: "Mobile"  },
  { name: "Tablet",   gjsName: "Tablet",           icon: <Tablet     className="h-3.5 w-3.5" />, label: "Tablet"  },
  { name: "Desktop",  gjsName: "Desktop",          icon: <Monitor    className="h-3.5 w-3.5" />, label: "Desktop" },
];

interface Props { company: Company; jobs: Job[] }

export default function GrapejsCanvas({ company, jobs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef    = useRef<any>(null);
  const [saveStatus,   setSaveStatus]   = useState<SaveStatus>("idle");
  const [pubStatus,    setPubStatus]    = useState<PubStatus>("idle");
  const [ready,        setReady]        = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceName>("Desktop");
  const [isPreviewing, setIsPreviewing] = useState(false);

  // ── GrapeJS init ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let editor: any;
    let mounted = true; // guard against React StrictMode double-invoke
    const primaryColor = company.theme?.primaryColor ?? "#6366f1";

    import("grapesjs").then(({ default: gjs }) => {
      // StrictMode unmounts+remounts in dev — bail if we were already cleaned up
      if (!mounted || !containerRef.current) return;

      editor = gjs.init({
        container: containerRef.current!,
        fromElement: false,
        height: "100%",
        width: "auto",
        storageManager: false,
        deviceManager: {
          devices: [
            { name: "Desktop",          width: ""      },
            { name: "Tablet",           width: "768px", widthMedia: "768px" },
            { name: "Mobile portrait",  width: "375px", widthMedia: "480px" },
          ],
        },
        blockManager: { blocks: buildCareerBlocks(company) },
        canvas: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assetManager: {
          upload: false,
          // Called when the user selects files in the asset manager dialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          uploadFile: async (e: any) => {
            const files: FileList | null =
              e?.target?.files ?? e?.dataTransfer?.files ?? null;
            if (!files?.length) return;

            const am = editor.AssetManager;
            for (const file of Array.from(files) as File[]) {
              try {
                const url = await uploadToCloudinary(file);
                am.add([{ src: url, type: "image", name: file.name }]);
                am.render();
              } catch (err) {
                console.error("[Cloudinary] Upload failed:", err);
                alert("Image upload failed. Check your Cloudinary env vars.");
              }
            }
          },
        } as any,
      });

      // Inject UI theme CSS into the main document (panels, toolbar, blocks)
      const uiStyle = document.createElement("style");
      uiStyle.id = "gjs-ui-theme";
      uiStyle.textContent = buildGjsUITheme(primaryColor);
      document.head.appendChild(uiStyle);

      // Inject canvas iframe CSS (brand color, resets)
      editor.on("load", () => {
        try {
          const doc = editor.Canvas.getDocument();
          const style = doc.createElement("style");
          style.textContent = buildCanvasCSS(primaryColor);
          doc.head.appendChild(style);
        } catch { /* iframe not ready */ }
        setReady(true);
      });

      // Close asset manager modal automatically after an image is selected
      editor.on("asset:select", () => {
        editor.AssetManager.close();
      });

      // Track preview mode — GrapeJS fires the generic "run"/"stop" event
      // with the command id as the first argument
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.on("run", (id: any) => { if (id === "core:preview") setIsPreviewing(true); });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.on("stop", (id: any) => { if (id === "core:preview") setIsPreviewing(false); });

      // Restore saved project
      if (company.grapesjs_data && Object.keys(company.grapesjs_data).length > 0) {
        editor.loadProjectData(
          company.grapesjs_data as Parameters<typeof editor.loadProjectData>[0]
        );
      }

      editorRef.current = editor;
    });

    return () => {
      mounted = false;
      document.getElementById("gjs-ui-theme")?.remove();
      try { editor?.destroy(); } catch { /* ignore */ }
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;
    setSaveStatus("saving");
    const data = editorRef.current.getProjectData() as Record<string, unknown>;
    const result = await saveGrapejsData(data);
    if (result.ok) { setSaveStatus("saved"); setTimeout(() => setSaveStatus("idle"), 2500); }
    else           { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
  }, []);

  const handlePublish = useCallback(async () => {
    if (!editorRef.current) return;
    setPubStatus("publishing");
    const html = editorRef.current.getHtml() as string;
    const css  = editorRef.current.getCss()  as string;
    const result = await publishGrapejsPage(html, css);
    if (result.ok) { setPubStatus("published"); setTimeout(() => setPubStatus("idle"), 3000); }
    else           { setPubStatus("idle"); }
  }, []);

  const handleDevice = useCallback((device: (typeof DEVICES)[number]) => {
    setActiveDevice(device.name);
    editorRef.current?.setDevice(device.gjsName);
  }, []);

  const handleUndo        = useCallback(() => editorRef.current?.runCommand("core:undo"),  []);
  const handleRedo        = useCallback(() => editorRef.current?.runCommand("core:redo"),  []);
  const handleEnterPreview = useCallback(() => { editorRef.current?.runCommand("core:preview"); setIsPreviewing(true); }, []);
  const handleExitPreview = useCallback(() => { editorRef.current?.stopCommand("core:preview"); setIsPreviewing(false); }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-full flex-col bg-background lg:flex-row">
      <AppSidebar companySlug={company.slug} isPublished={company.published_at !== null} />

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <header className={cn(
          "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2",
          isPreviewing ? "bg-gray-900" : "bg-background"
        )}>

          {/* Brand + title */}
          <div className="min-w-0">
            <Link href="/dashboard" className={cn("text-xs transition-colors", isPreviewing ? "text-gray-400 hover:text-white" : "text-muted-foreground hover:text-foreground")}>
              ← Dashboard
            </Link>
            <h1 className={cn("truncate text-sm font-semibold leading-tight", isPreviewing ? "text-white" : "text-foreground")}>{company.name}</h1>
            <p className={cn("text-[10px]", isPreviewing ? "text-gray-400" : "text-muted-foreground")}>
              {isPreviewing ? "Preview mode" : "Canvas Builder"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* ── Preview / Exit Preview toggle ───────────────────────────── */}
            {isPreviewing ? (
              <Button size="sm" onClick={handleExitPreview} className="bg-white text-gray-900 hover:bg-gray-100 border-0 font-semibold">
                <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                Exit Preview
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleEnterPreview} disabled={!ready}>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
            )}

            {/* ── Device toggle tabs — desktop-only; meaningless when you're
                already viewing this on the device it simulates ──────────── */}
            <div className="hidden items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-1 lg:flex">
              {DEVICES.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  title={d.label}
                  aria-pressed={activeDevice === d.name}
                  onClick={() => handleDevice(d)}
                  disabled={!ready}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-md px-2.5 py-1 transition-all duration-150 disabled:opacity-40",
                    activeDevice === d.name
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d.icon}
                  <span className="text-[9px] font-semibold leading-none">{d.label}</span>
                </button>
              ))}
            </div>

            {/* ── Undo / Redo ───────────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-1">
              <button
                type="button"
                title="Undo (Ctrl+Z)"
                onClick={handleUndo}
                disabled={!ready}
                className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Redo (Ctrl+Y)"
                onClick={handleRedo}
                disabled={!ready}
                className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* ── Auto-save pill ────────────────────────────────────────── */}
            <span className="hidden items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
              <span className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                saveStatus === "saving" ? "animate-pulse bg-amber-400" : "bg-emerald-400"
              )} />
              {saveStatus === "saving" ? "Saving…" : "Auto-save on"}
            </span>

            {/* ── Loading ───────────────────────────────────────────────── */}
            {!ready && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading…
              </span>
            )}

            {/* ── Save / Publish ────────────────────────────────────────── */}
            <Button variant="outline" size="sm" onClick={handleSave} disabled={!ready || saveStatus === "saving"}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : "Save Draft"}
            </Button>

            <Button size="sm" onClick={handlePublish} disabled={!ready || pubStatus === "publishing"}>
              <Globe className="mr-1.5 h-3.5 w-3.5" />
              {pubStatus === "publishing" ? "Publishing…" : pubStatus === "published" ? "Published ✓" : "Publish"}
            </Button>

            {company.published_at && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${company.slug}/career`} target="_blank" rel="noopener noreferrer">
                  View Live ↗
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* ── GrapeJS canvas ──────────────────────────────────────────────── */}
        {/* flex-1 alone sizes this correctly regardless of how tall the
            header above renders — it can wrap to two rows on narrow
            screens now that the toolbar uses flex-wrap. */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div ref={containerRef} className="h-full w-full" />

          {/* Floating Exit Preview button — only visible in preview mode */}
          {isPreviewing && (
            <button
              type="button"
              onClick={handleExitPreview}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-gray-900/90 px-5 py-2.5 text-sm font-semibold text-white shadow-xl backdrop-blur-sm hover:bg-gray-900 transition-colors"
            >
              <EyeOff className="h-4 w-4" />
              Exit Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
