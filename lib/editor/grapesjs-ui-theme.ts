/**
 * CSS overrides that retheme GrapeJS's built-in dark UI to match the app's
 * light palette and purple primary color.
 *
 * Injected into the main document head (not the canvas iframe) when the
 * editor mounts so it never pollutes the recruiter-facing pages.
 */

export function buildGjsUITheme(primaryColor: string): string {
  return `
/* ── Palette reset ──────────────────────────────────────────────────────── */
.gjs-one-bg   { background-color: #ffffff !important; }
.gjs-two-bg   { background-color: #f9fafb !important; }
.gjs-three-bg { background-color: #f3f4f6 !important; }
.gjs-four-bg  { background-color: #e5e7eb !important; }

.gjs-color-main   { color: #111827 !important; }
.gjs-color-active { color: ${primaryColor} !important; }
.gjs-color-warn   { color: #f59e0b !important; }

/* ── Editor shell ───────────────────────────────────────────────────────── */
.gjs-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  background: #f1f5f9 !important;
}
.gjs-editor-cont { background: #f1f5f9 !important; }

/* ── All panels ─────────────────────────────────────────────────────────── */
.gjs-pn-panel {
  background: #ffffff !important;
  border-color: #e5e7eb !important;
}

/* ── Top command bar (device toggle, undo/redo, view icons) ─────────────── */
.gjs-pn-commands {
  background: #ffffff !important;
  border-bottom: 1px solid #e5e7eb !important;
  min-height: 44px !important;
  padding: 4px 8px !important;
  display: flex !important;
  align-items: center !important;
  box-shadow: 0 1px 3px rgba(0,0,0,.04) !important;
}
.gjs-pn-options {
  background: #ffffff !important;
  border-bottom: 1px solid #e5e7eb !important;
}

/* ── Right panel view-switcher tabs ─────────────────────────────────────── */
.gjs-pn-views {
  background: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-left: 1px solid #e5e7eb !important;
}
.gjs-pn-views-container {
  background: #ffffff !important;
  border-left: 1px solid #e5e7eb !important;
}

/* ── Left sidebar ───────────────────────────────────────────────────────── */
.gjs-pn-views-container .gjs-pn-panel { border-right: 1px solid #e5e7eb !important; }

/* ── Panel icon buttons ─────────────────────────────────────────────────── */
.gjs-pn-btn {
  color: #6b7280 !important;
  border-radius: 6px !important;
  margin: 2px !important;
  padding: 6px 8px !important;
  transition: background .12s, color .12s !important;
}
.gjs-pn-btn:hover {
  background: #f3f4f6 !important;
  color: #111827 !important;
}
.gjs-pn-btn.gjs-pn-active {
  background: color-mix(in srgb, ${primaryColor} 12%, transparent) !important;
  color: ${primaryColor} !important;
}

/* ── Block manager ──────────────────────────────────────────────────────── */
.gjs-block-categories { background: #ffffff !important; }

.gjs-block-category > .gjs-title {
  background: #f8f9fa !important;
  color: #374151 !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  padding: 8px 12px !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-top: 1px solid #e5e7eb !important;
}
.gjs-block-category > .gjs-title:hover {
  background: color-mix(in srgb, ${primaryColor} 8%, transparent) !important;
  color: ${primaryColor} !important;
}

.gjs-blocks-c { padding: 8px !important; gap: 6px !important; }
.gjs-block {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  color: #374151 !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  padding: 12px 8px !important;
  transition: border-color .15s, background .15s, box-shadow .15s !important;
  box-shadow: none !important;
}
.gjs-block:hover {
  border-color: ${primaryColor} !important;
  background: color-mix(in srgb, ${primaryColor} 6%, #fff) !important;
  color: ${primaryColor} !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, ${primaryColor} 12%, transparent) !important;
}
.gjs-block-label { font-size: 10px !important; font-weight: 700 !important; }
.gjs-block .gjs-block-svg-path { fill: ${primaryColor} !important; }
.gjs-block .gjs-block__media { color: ${primaryColor} !important; font-size: 1.5rem !important; margin-bottom: 4px !important; }

/* ── Layer manager ──────────────────────────────────────────────────────── */
.gjs-layer-title {
  color: #374151 !important;
  border-bottom: 1px solid #f3f4f6 !important;
  font-size: 12px !important;
}
.gjs-layer-title-inner { color: #374151 !important; }
.gjs-layer:hover > .gjs-layer-title { background: #f9fafb !important; }
.gjs-layer.gjs-selected > .gjs-layer-title {
  background: color-mix(in srgb, ${primaryColor} 8%, transparent) !important;
  color: ${primaryColor} !important;
}
.gjs-layer-count {
  background: ${primaryColor} !important;
  color: #ffffff !important;
  border-radius: 4px !important;
}
.gjs-layer-caret { color: #9ca3af !important; }

/* ── Style manager ──────────────────────────────────────────────────────── */
.gjs-sm-sector { border-bottom: 1px solid #e5e7eb !important; }
.gjs-sm-sector-title, .gjs-sm-title {
  background: #f8f9fa !important;
  color: #374151 !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  padding: 8px 12px !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: pointer !important;
}
.gjs-sm-sector-title:hover, .gjs-sm-title:hover {
  background: color-mix(in srgb, ${primaryColor} 6%, transparent) !important;
  color: ${primaryColor} !important;
}
.gjs-sm-sector .gjs-sm-properties { padding: 10px 12px !important; }
.gjs-sm-label {
  color: #6b7280 !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: .04em !important;
}
.gjs-sm-field,
.gjs-sm-field input,
.gjs-sm-field select,
.gjs-sm-field textarea {
  background: #f9fafb !important;
  color: #111827 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 5px !important;
  font-size: 12px !important;
}
.gjs-sm-field input:focus,
.gjs-sm-field select:focus {
  border-color: ${primaryColor} !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, ${primaryColor} 20%, transparent) !important;
  outline: none !important;
}
.gjs-sm-field.gjs-sm-color-picker-bg { padding: 0 !important; }
.gjs-clm-tag {
  background: color-mix(in srgb, ${primaryColor} 12%, transparent) !important;
  color: ${primaryColor} !important;
  border-radius: 4px !important;
  font-size: 10px !important;
  font-weight: 700 !important;
}

/* ── Traits (component properties) ─────────────────────────────────────── */
.gjs-trt-trait { border-bottom: 1px solid #f3f4f6 !important; padding: 8px 12px !important; }
.gjs-trt-trait label { color: #6b7280 !important; font-size: 11px !important; font-weight: 600 !important; }
.gjs-trt-trait__wrp-label { color: #6b7280 !important; }
.gjs-trt-trait input, .gjs-trt-trait select {
  background: #f9fafb !important;
  color: #111827 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 5px !important;
  font-size: 12px !important;
}
.gjs-trt-trait input:focus, .gjs-trt-trait select:focus {
  border-color: ${primaryColor} !important;
  outline: none !important;
}

/* ── Element toolbar (floating over selected element) ───────────────────── */
.gjs-toolbar {
  background: #111827 !important;
  border-radius: 8px !important;
  padding: 4px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1) !important;
  border: none !important;
}
.gjs-toolbar-item {
  color: #d1d5db !important;
  padding: 5px 8px !important;
  border-radius: 5px !important;
  cursor: pointer !important;
  transition: background .1s, color .1s !important;
}
.gjs-toolbar-item:hover {
  background: rgba(255,255,255,0.12) !important;
  color: #ffffff !important;
}
.gjs-toolbar-item svg { fill: currentColor !important; }

/* ── Badge (component type label) ──────────────────────────────────────── */
.gjs-badge {
  background: ${primaryColor} !important;
  color: #ffffff !important;
  border-radius: 4px 4px 0 0 !important;
  font-size: 9px !important;
  font-weight: 700 !important;
  letter-spacing: .04em !important;
  text-transform: uppercase !important;
  padding: 2px 7px !important;
}

/* ── Selection highlight ────────────────────────────────────────────────── */
.gjs-selected {
  outline: 2px solid ${primaryColor} !important;
  outline-offset: -1px !important;
}

/* ── Hover highlight ────────────────────────────────────────────────────── */
.gjs-hovered {
  outline: 1px dashed color-mix(in srgb, ${primaryColor} 60%, transparent) !important;
  outline-offset: -1px !important;
}

/* ── Drag placeholder ───────────────────────────────────────────────────── */
.gjs-placeholder {
  border: 2px dashed ${primaryColor} !important;
  border-radius: 4px !important;
}
.gjs-placeholder-int { background: color-mix(in srgb, ${primaryColor} 8%, transparent) !important; }

/* ── Device switcher tabs ───────────────────────────────────────────────── */
.gjs-devices-c { display: flex !important; align-items: center !important; gap: 2px !important; }
.gjs-devices-c button {
  font-size: 10px !important;
  font-weight: 700 !important;
  border-radius: 5px !important;
  padding: 4px 10px !important;
  color: #6b7280 !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
  text-transform: uppercase !important;
  letter-spacing: .04em !important;
  transition: background .12s, color .12s !important;
}
.gjs-devices-c button.gjs-pn-active,
.gjs-devices-c button[class*="active"] {
  background: color-mix(in srgb, ${primaryColor} 12%, transparent) !important;
  color: ${primaryColor} !important;
}
.gjs-devices-c button:hover { background: #f3f4f6 !important; color: #111827 !important; }

/* ── Scrollbars ─────────────────────────────────────────────────────────── */
.gjs-pn-panel::-webkit-scrollbar,
.gjs-block-categories::-webkit-scrollbar,
.gjs-sm-sector::-webkit-scrollbar { width: 5px !important; height: 5px !important; }
.gjs-pn-panel::-webkit-scrollbar-thumb { background: #d1d5db !important; border-radius: 10px !important; }
.gjs-pn-panel::-webkit-scrollbar-track { background: transparent !important; }

/* ── Code editor modal ──────────────────────────────────────────────────── */
.gjs-mdl-dialog {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
  border: 1px solid #e5e7eb !important;
}
.gjs-mdl-header {
  background: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  color: #111827 !important;
  font-weight: 700 !important;
  border-radius: 12px 12px 0 0 !important;
}
.gjs-mdl-btn-close {
  color: #6b7280 !important;
  font-size: 1.25rem !important;
}
.gjs-mdl-btn-close:hover { color: #111827 !important; }
.gjs-mdl-content { color: #374151 !important; }

/* ── Color picker swatch ────────────────────────────────────────────────── */
.gjs-field-colorp-c { border: 1px solid #e5e7eb !important; border-radius: 4px !important; }

/* ── Radio/checkbox in style manager ────────────────────────────────────── */
.gjs-sm-btn, .gjs-btn-prim {
  background: ${primaryColor} !important;
  color: #ffffff !important;
  border-radius: 5px !important;
  border: none !important;
  padding: 5px 12px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}
.gjs-sm-btn:hover, .gjs-btn-prim:hover { opacity: .88 !important; }

/* ── No-selection state ─────────────────────────────────────────────────── */
.gjs-sm-empty { color: #9ca3af !important; font-size: 12px !important; padding: 24px !important; text-align: center !important; }
.gjs-layer-empty { color: #9ca3af !important; font-size: 12px !important; padding: 24px !important; text-align: center !important; }

/* ── Selector / Class manager (top of right panel) ──────────────────────── */
.gjs-clm-tags,
.gjs-clm-tags-c,
.gjs-clm-header {
  background: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 8px 12px !important;
}
.gjs-clm-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
.gjs-clm-header-label,
.gjs-clm-label {
  color: #374151 !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: .06em !important;
}
.gjs-clm-states,
.gjs-clm-states select {
  background: #ffffff !important;
  color: #374151 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 5px !important;
  font-size: 11px !important;
  padding: 3px 6px !important;
}
.gjs-clm-tags-input input {
  background: #ffffff !important;
  color: #111827 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 5px !important;
  font-size: 12px !important;
  padding: 4px 8px !important;
}
.gjs-clm-tags-input input::placeholder { color: #9ca3af !important; }
.gjs-clm-tag {
  background: color-mix(in srgb, ${primaryColor} 12%, #fff) !important;
  color: ${primaryColor} !important;
  border-radius: 4px !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  padding: 2px 6px !important;
}
.gjs-clm-tag-ic { color: ${primaryColor} !important; opacity: .7 !important; }
.gjs-clm-tag-ic:hover { opacity: 1 !important; }

/* ── Selected component info bar ─────────────────────────────────────────── */
.gjs-comp-name {
  color: #374151 !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  background: #f3f4f6 !important;
  padding: 6px 12px !important;
  border-bottom: 1px solid #e5e7eb !important;
}

/* ── Universal GrapeJS text fallback (catches any missed elements) ────────── */
[class^="gjs-"],
[class*=" gjs-"] {
  color: inherit;
}
.gjs-pn-views-container,
.gjs-pn-views-container * {
  color: #374151;
}
/* Let our specific rules override where set */
.gjs-pn-views-container .gjs-sm-label { color: #6b7280 !important; }
.gjs-pn-views-container .gjs-sm-sector-title { color: #374151 !important; }
.gjs-pn-views-container .gjs-sm-field,
.gjs-pn-views-container .gjs-sm-field input,
.gjs-pn-views-container .gjs-sm-field select {
  color: #111827 !important;
  background: #f9fafb !important;
}

/* ── Right panel views tab icons ─────────────────────────────────────────── */
.gjs-pn-views .gjs-pn-btn {
  color: #6b7280 !important;
  font-size: 16px !important;
}
.gjs-pn-views .gjs-pn-btn.gjs-pn-active {
  color: ${primaryColor} !important;
  background: color-mix(in srgb, ${primaryColor} 10%, transparent) !important;
}

/* ── Sector arrow caret ───────────────────────────────────────────────────── */
.gjs-sm-sector-title .gjs-sm-caret,
.gjs-sm-sector-title .gjs-arrow,
.gjs-sm-sector .gjs-sm-sector__close {
  color: #6b7280 !important;
}
.gjs-sm-sector-title:hover .gjs-sm-caret { color: ${primaryColor} !important; }

/* ── Hide GrapeJS's built-in device panel (we render our own tabs) ───────── */
.gjs-devices-c { display: none !important; }

/* ── Hide GrapeJS's built-in preview toggle (tiny fa-eye icon) — we render
   our own larger, clearly labeled Preview / Exit Preview buttons instead ─── */
.gjs-pn-btn[title="Preview"] { display: none !important; }

/* ── Block thumbnail improvements ───────────────────────────────────────── */
.gjs-block {
  width: calc(50% - 4px) !important;
  text-align: center !important;
}
.gjs-block__media {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-bottom: 8px !important;
  border-radius: 6px !important;
  overflow: hidden !important;
}
.gjs-block__media svg { width: 100% !important; height: auto !important; }
.gjs-blocks-c {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  padding: 8px !important;
}
/* Full-width for section blocks (Category: Career Sections) */
.gjs-block-category:first-child .gjs-block {
  width: calc(50% - 4px) !important;
}
/* Smaller element blocks */
.gjs-block-category .gjs-block { font-size: 11px !important; }
`;

}
