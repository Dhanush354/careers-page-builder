import { Label } from "@/components/ui/label";
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

export function BrandingPanel({
  theme,
  onChange,
}: {
  theme: CompanyTheme;
  onChange: (theme: CompanyTheme) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ColorField
        id="primary-color"
        label="Primary color"
        value={theme.primaryColor ?? "#2563eb"}
        onChange={(value) => onChange({ ...theme, primaryColor: value })}
      />
      <ColorField
        id="secondary-color"
        label="Secondary color"
        value={theme.secondaryColor ?? "#0f172a"}
        onChange={(value) => onChange({ ...theme, secondaryColor: value })}
      />
    </div>
  );
}
