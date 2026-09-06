import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ValueItem } from "@/types/company";

const MAX_ITEMS = 8;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `value-${Date.now()}-${Math.random()}`;
}

export function ValuesItemsEditor({
  items,
  onChange,
}: {
  items: ValueItem[];
  onChange: (items: ValueItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<ValueItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: createId(), title: "", description: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-2 rounded-md border border-border p-3">
          <p className="text-xs font-medium text-muted-foreground">Value {index + 1}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`value-title-${item.id}`}>Title</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{item.title.length} / 80</span>
            </div>
            <Input
              id={`value-title-${item.id}`}
              maxLength={80}
              placeholder="Ship fast"
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`value-desc-${item.id}`}>Description</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{item.description.length} / 300</span>
            </div>
            <Textarea
              id={`value-desc-${item.id}`}
              maxLength={300}
              rows={2}
              placeholder="1–2 sentences describing this value..."
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
        + Add Value
      </Button>
      {items.length >= MAX_ITEMS && (
        <p className="text-xs text-muted-foreground">Values supports up to {MAX_ITEMS} items.</p>
      )}
    </div>
  );
}
