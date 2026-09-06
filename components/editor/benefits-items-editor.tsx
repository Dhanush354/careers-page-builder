import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BenefitItem } from "@/types/company";

const MAX_ITEMS = 12;

const EMOJI_SUGGESTIONS = ["🏥","🌍","📚","🏖️","💻","🎉","🤝","⚡","🏋️","🍕","🚀","💰"];

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `benefit-${Date.now()}-${Math.random()}`;
}

export function BenefitsItemsEditor({
  items,
  onChange,
}: {
  items: BenefitItem[];
  onChange: (items: BenefitItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<BenefitItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: createId(), emoji: "✨", title: "", description: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {EMOJI_SUGGESTIONS.map((e) => (
          <span key={e} className="cursor-default text-base" title={e}>{e}</span>
        ))}
        <span className="text-xs text-muted-foreground self-center ml-1">← copy an emoji into the field</span>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-2 rounded-md border border-border p-3">
          <p className="text-xs font-medium text-muted-foreground">Benefit {index + 1}</p>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1.5 w-16 shrink-0">
              <Label htmlFor={`benefit-emoji-${item.id}`}>Emoji</Label>
              <Input
                id={`benefit-emoji-${item.id}`}
                maxLength={8}
                placeholder="🏥"
                value={item.emoji}
                className="text-center text-lg"
                onChange={(e) => updateItem(item.id, { emoji: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-baseline justify-between">
                <Label htmlFor={`benefit-title-${item.id}`}>Title</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{item.title.length} / 80</span>
              </div>
              <Input
                id={`benefit-title-${item.id}`}
                maxLength={80}
                placeholder="Health & Dental"
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`benefit-desc-${item.id}`}>Description</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{item.description.length} / 200</span>
            </div>
            <Input
              id={`benefit-desc-${item.id}`}
              maxLength={200}
              placeholder="Short description..."
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
              Remove
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        disabled={items.length >= MAX_ITEMS}
      >
        + Add Benefit
      </Button>
      {items.length >= MAX_ITEMS && (
        <p className="text-xs text-muted-foreground">Benefits supports up to {MAX_ITEMS} items.</p>
      )}
    </div>
  );
}
