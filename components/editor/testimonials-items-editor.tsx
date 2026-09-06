import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TestimonialItem } from "@/types/company";

const MAX_ITEMS = 6;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `testimonial-${Date.now()}-${Math.random()}`;
}

export function TestimonialsItemsEditor({
  items,
  onChange,
}: {
  items: TestimonialItem[];
  onChange: (items: TestimonialItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<TestimonialItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: createId(), quote: "", name: "", role: "", avatarInitials: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-2 rounded-md border border-border p-3">
          <p className="text-xs font-medium text-muted-foreground">Testimonial {index + 1}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`t-quote-${item.id}`}>Quote</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{item.quote.length} / 300</span>
            </div>
            <Textarea
              id={`t-quote-${item.id}`}
              maxLength={300}
              rows={3}
              placeholder="What they said about working here..."
              value={item.quote}
              onChange={(e) => updateItem(item.id, { quote: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-baseline justify-between">
                <Label htmlFor={`t-name-${item.id}`}>Name</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{item.name.length} / 80</span>
              </div>
              <Input
                id={`t-name-${item.id}`}
                maxLength={80}
                placeholder="Alex R."
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-20 shrink-0">
              <Label htmlFor={`t-initials-${item.id}`}>Initials</Label>
              <Input
                id={`t-initials-${item.id}`}
                maxLength={3}
                placeholder="AR"
                value={item.avatarInitials}
                className="text-center uppercase"
                onChange={(e) => updateItem(item.id, { avatarInitials: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`t-role-${item.id}`}>Role</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{item.role.length} / 80</span>
            </div>
            <Input
              id={`t-role-${item.id}`}
              maxLength={80}
              placeholder="Senior Engineer"
              value={item.role}
              onChange={(e) => updateItem(item.id, { role: e.target.value })}
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
        + Add Testimonial
      </Button>
      {items.length >= MAX_ITEMS && (
        <p className="text-xs text-muted-foreground">Testimonials supports up to {MAX_ITEMS} items.</p>
      )}
    </div>
  );
}
