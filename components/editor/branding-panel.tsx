import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FONT_OPTIONS, FONT_SIZE_OPTIONS } from "@/lib/editor/theme-options";
import { STYLE_PRESETS } from "@/lib/editor/style-presets";
import type { CompanyTheme } from "@/types/company";

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isValidHex = HEX_PATTERN.test(value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div
        className="flex items-center gap-2 rounded-lg border border-input bg-background px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
      >
        <label
          htmlFor={id}
          className="relative flex size-7 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border"
          style={{ backgroundColor: isValidHex ? value : "#000000" }}
        >
          <input
            id={id}
            type="color"
            value={isValidHex ? value : "#000000"}
            onChange={(event) => onChange(event.target.value)}
            aria-label={`${label} picker`}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#2563EB"
          aria-invalid={!isValidHex}
          aria-label={`${label} hex value`}
          className="w-full min-w-0 bg-transparent font-mono text-sm uppercase text-foreground outline-none placeholder:text-muted-foreground placeholder:normal-case"
        />
      </div>
      {!isValidHex && (
        <p className="text-xs text-destructive">
          Enter a valid hex color (e.g. #2563EB).
        </p>
      )}
    </div>
  );
}

function PillPicker<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
              value === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BrandingPanel({
  theme,
  onChange,
}: {
  theme: CompanyTheme;
  onChange: (theme: CompanyTheme) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Style presets ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-foreground">Style presets</p>
        <p className="text-xs text-muted-foreground">
          Apply a ready-made font + color combo, then tweak anything below.
        </p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ ...theme, ...preset.theme, presetId: preset.id })}
              aria-pressed={theme.presetId === preset.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors",
                theme.presetId === preset.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              <span className="flex shrink-0 -space-x-1.5">
                <span
                  className="size-4 rounded-full ring-2 ring-background"
                  style={{ backgroundColor: preset.swatch[0] }}
                />
                <span
                  className="size-4 rounded-full ring-2 ring-background"
                  style={{ backgroundColor: preset.swatch[1] }}
                />
              </span>
              <span className="truncate">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* ── Colors ────────────────────────────────────────────────────── */}
      <ColorField
        id="primary-color"
        label="Primary color"
        value={theme.primaryColor ?? "#2563eb"}
        onChange={(value) => onChange({ ...theme, primaryColor: value, presetId: undefined })}
      />
      <ColorField
        id="secondary-color"
        label="Secondary color"
        value={theme.secondaryColor ?? "#0f172a"}
        onChange={(value) => onChange({ ...theme, secondaryColor: value, presetId: undefined })}
      />
      <ColorField
        id="text-color"
        label="Text color"
        value={theme.textColor ?? "#111827"}
        onChange={(value) => onChange({ ...theme, textColor: value, presetId: undefined })}
      />

      <div className="h-px bg-border" />

      {/* ── Typography ────────────────────────────────────────────────── */}
      <PillPicker
        label="Font"
        value={theme.fontFamily ?? "inter"}
        onChange={(fontFamily) => onChange({ ...theme, fontFamily, presetId: undefined })}
        options={FONT_OPTIONS.map((f) => ({ value: f.id, label: f.label }))}
      />
      <PillPicker
        label="Text size"
        value={theme.fontSize ?? "md"}
        onChange={(fontSize) => onChange({ ...theme, fontSize, presetId: undefined })}
        options={FONT_SIZE_OPTIONS.map((s) => ({ value: s.id, label: s.label }))}
      />
    </div>
  );
}
