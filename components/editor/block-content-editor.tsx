import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BenefitsItemsEditor } from "@/components/editor/benefits-items-editor";
import { FaqItemsEditor } from "@/components/editor/faq-items-editor";
import { HiringProcessStepsEditor } from "@/components/editor/hiring-process-steps-editor";
import { StatsItemsEditor } from "@/components/editor/stats-items-editor";
import { TestimonialsItemsEditor } from "@/components/editor/testimonials-items-editor";
import { ValuesItemsEditor } from "@/components/editor/values-items-editor";
import { cn } from "@/lib/utils";
import type { PageBlock } from "@/types/company";

function FieldLabel({
  htmlFor,
  children,
  count,
  max,
}: {
  htmlFor: string;
  children: string;
  count: number;
  max: number;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <Label htmlFor={htmlFor}>{children}</Label>
      <span className="text-xs tabular-nums text-muted-foreground">
        {count} / {max}
      </span>
    </div>
  );
}

function LayoutPicker<T extends string>({
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
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
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

export function BlockContentEditor({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (block: PageBlock) => void;
}) {
  const idPrefix = block.id;

  switch (block.type) {
    case "hero":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={`${idPrefix}-heading`}
              count={block.content.heading.length}
              max={120}
            >
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(event) =>
                onChange({
                  ...block,
                  content: { ...block.content, heading: event.target.value },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={`${idPrefix}-description`}
              count={block.content.description.length}
              max={300}
            >
              Description
            </FieldLabel>
            <Textarea
              id={`${idPrefix}-description`}
              maxLength={300}
              rows={3}
              value={block.content.description}
              onChange={(event) =>
                onChange({
                  ...block,
                  content: {
                    ...block.content,
                    description: event.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      );

    case "about":
    case "life":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={`${idPrefix}-heading`}
              count={block.content.heading.length}
              max={120}
            >
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(event) =>
                onChange({
                  ...block,
                  content: { ...block.content, heading: event.target.value },
                })
              }
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "centered", label: "Centered" },
              { value: "split", label: "Split" },
            ]}
            value={block.content.layout ?? "centered"}
            onChange={(layout) =>
              onChange({ ...block, content: { ...block.content, layout } })
            }
          />
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={`${idPrefix}-body`}
              count={block.content.body.length}
              max={2000}
            >
              Body
            </FieldLabel>
            <Textarea
              id={`${idPrefix}-body`}
              maxLength={2000}
              rows={5}
              value={block.content.body}
              onChange={(event) =>
                onChange({
                  ...block,
                  content: { ...block.content, body: event.target.value },
                })
              }
            />
          </div>
        </div>
      );

    case "stats":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={`${idPrefix}-heading`}
              count={block.content.heading.length}
              max={120}
            >
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(event) =>
                onChange({
                  ...block,
                  content: { ...block.content, heading: event.target.value },
                })
              }
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "row", label: "Row" },
              { value: "large", label: "Large Cards" },
            ]}
            value={block.content.layout ?? "row"}
            onChange={(layout) =>
              onChange({ ...block, content: { ...block.content, layout } })
            }
          />
          <StatsItemsEditor
            items={block.content.items}
            onChange={(items) =>
              onChange({ ...block, content: { ...block.content, items } })
            }
          />
        </div>
      );

    case "faq":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={`${idPrefix}-heading`}
              count={block.content.heading.length}
              max={120}
            >
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(event) =>
                onChange({
                  ...block,
                  content: { ...block.content, heading: event.target.value },
                })
              }
            />
          </div>
          <FaqItemsEditor
            items={block.content.items}
            onChange={(items) =>
              onChange({ ...block, content: { ...block.content, items } })
            }
          />
        </div>
      );

    case "benefits":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-heading`} count={block.content.heading.length} max={120}>
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(e) => onChange({ ...block, content: { ...block.content, heading: e.target.value } })}
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "grid-2", label: "2 Columns" },
              { value: "grid-3", label: "3 Columns" },
              { value: "grid-4", label: "4 Columns" },
              { value: "list", label: "List" },
            ]}
            value={block.content.layout ?? "grid-3"}
            onChange={(layout) => onChange({ ...block, content: { ...block.content, layout } })}
          />
          <BenefitsItemsEditor
            items={block.content.items}
            onChange={(items) => onChange({ ...block, content: { ...block.content, items } })}
          />
        </div>
      );

    case "values":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-heading`} count={block.content.heading.length} max={120}>
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(e) => onChange({ ...block, content: { ...block.content, heading: e.target.value } })}
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "numbered", label: "Numbered" },
              { value: "grid-2", label: "2 Columns" },
              { value: "grid-3", label: "3 Columns" },
            ]}
            value={block.content.layout ?? "numbered"}
            onChange={(layout) => onChange({ ...block, content: { ...block.content, layout } })}
          />
          <ValuesItemsEditor
            items={block.content.items}
            onChange={(items) => onChange({ ...block, content: { ...block.content, items } })}
          />
        </div>
      );

    case "testimonials":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-heading`} count={block.content.heading.length} max={120}>
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(e) => onChange({ ...block, content: { ...block.content, heading: e.target.value } })}
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "grid-2", label: "2 Columns" },
              { value: "grid-3", label: "3 Columns" },
            ]}
            value={block.content.layout ?? "grid-3"}
            onChange={(layout) => onChange({ ...block, content: { ...block.content, layout } })}
          />
          <TestimonialsItemsEditor
            items={block.content.items}
            onChange={(items) => onChange({ ...block, content: { ...block.content, items } })}
          />
        </div>
      );

    case "hiringProcess":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-heading`} count={block.content.heading.length} max={120}>
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(e) => onChange({ ...block, content: { ...block.content, heading: e.target.value } })}
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ]}
            value={block.content.layout ?? "horizontal"}
            onChange={(layout) => onChange({ ...block, content: { ...block.content, layout } })}
          />
          <HiringProcessStepsEditor
            steps={block.content.steps}
            onChange={(steps) => onChange({ ...block, content: { ...block.content, steps } })}
          />
        </div>
      );

    case "ctaBanner":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-heading`} count={block.content.heading.length} max={120}>
              Heading
            </FieldLabel>
            <Input
              id={`${idPrefix}-heading`}
              maxLength={120}
              value={block.content.heading}
              onChange={(e) => onChange({ ...block, content: { ...block.content, heading: e.target.value } })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-subtext`} count={block.content.subtext.length} max={300}>
              Subtext
            </FieldLabel>
            <Textarea
              id={`${idPrefix}-subtext`}
              maxLength={300}
              rows={2}
              value={block.content.subtext}
              onChange={(e) => onChange({ ...block, content: { ...block.content, subtext: e.target.value } })}
            />
          </div>
          <LayoutPicker
            label="Layout"
            options={[
              { value: "centered", label: "Centered" },
              { value: "split", label: "Split" },
            ]}
            value={block.content.layout ?? "centered"}
            onChange={(layout) => onChange({ ...block, content: { ...block.content, layout } })}
          />
          <LayoutPicker
            label="Background"
            options={[
              { value: "brand", label: "Brand" },
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            value={block.content.background ?? "brand"}
            onChange={(background) => onChange({ ...block, content: { ...block.content, background } })}
          />
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-btnlabel`} count={block.content.buttonLabel.length} max={60}>
              Button Label
            </FieldLabel>
            <Input
              id={`${idPrefix}-btnlabel`}
              maxLength={60}
              placeholder="See Open Roles"
              value={block.content.buttonLabel}
              onChange={(e) => onChange({ ...block, content: { ...block.content, buttonLabel: e.target.value } })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${idPrefix}-btnlink`}>Button Link</Label>
            <Input
              id={`${idPrefix}-btnlink`}
              type="url"
              placeholder="https://... or #open-roles"
              value={block.content.buttonLink}
              onChange={(e) => onChange({ ...block, content: { ...block.content, buttonLink: e.target.value } })}
            />
          </div>
        </div>
      );

    case "footer":
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={`${idPrefix}-tagline`} count={block.content.tagline.length} max={200}>
              Tagline
            </FieldLabel>
            <Textarea
              id={`${idPrefix}-tagline`}
              maxLength={200}
              rows={2}
              placeholder="We're building something great. Come join us."
              value={block.content.tagline}
              onChange={(e) => onChange({ ...block, content: { ...block.content, tagline: e.target.value } })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Equal Opportunity Statement</p>
              <p className="text-xs text-muted-foreground">Show an EEO statement in the footer</p>
            </div>
            <Switch
              checked={block.content.equalOpportunity}
              onCheckedChange={(v) => onChange({ ...block, content: { ...block.content, equalOpportunity: v } })}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Social Links</p>
            <div className="flex flex-col gap-2">
              {(["linkedin", "twitter", "github", "instagram"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <Label htmlFor={`${idPrefix}-${key}`} className="capitalize">{key === "twitter" ? "Twitter / X" : key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  <Input
                    id={`${idPrefix}-${key}`}
                    type="url"
                    placeholder={`https://${key}.com/yourcompany`}
                    value={block.content[key] ?? ""}
                    onChange={(e) => onChange({ ...block, content: { ...block.content, [key]: e.target.value } })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "openRoles":
      return (
        <p className="text-xs text-muted-foreground">
          Open Roles automatically lists your active jobs — there&apos;s
          nothing to configure here.
        </p>
      );
  }
}
