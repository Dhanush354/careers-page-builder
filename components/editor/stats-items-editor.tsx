import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StatItem } from "@/types/company";

const MAX_ITEMS = 4;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `stat-${Date.now()}-${Math.random()}`;
}

export function StatsItemsEditor({
  items,
  onChange,
}: {
  items: StatItem[];
  onChange: (items: StatItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<StatItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: createId(), value: "", label: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-2 rounded-md border border-border p-3"
        >
          <p className="text-xs font-medium text-muted-foreground">
            Stat {index + 1}
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`stat-value-${item.id}`}>Value</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.value.length} / 40
              </span>
            </div>
            <Input
              id={`stat-value-${item.id}`}
              maxLength={40}
              placeholder="50+"
              value={item.value}
              onChange={(event) =>
                updateItem(item.id, { value: event.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`stat-label-${item.id}`}>Label</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.label.length} / 80
              </span>
            </div>
            <Input
              id={`stat-label-${item.id}`}
              maxLength={80}
              placeholder="Team members"
              value={item.label}
              onChange={(event) =>
                updateItem(item.id, { label: event.target.value })
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Remove stat ${index + 1}`}
              onClick={() => removeItem(item.id)}
            >
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
        + Add Stat
      </Button>
      {items.length >= MAX_ITEMS && (
        <p className="text-xs text-muted-foreground">
          Stats supports up to {MAX_ITEMS} items.
        </p>
      )}
    </div>
  );
}
