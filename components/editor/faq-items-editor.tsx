import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FaqItem } from "@/types/company";

const MAX_ITEMS = 6;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `faq-${Date.now()}-${Math.random()}`;
}

export function FaqItemsEditor({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<FaqItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: createId(), question: "", answer: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-2 rounded-md border border-border p-3"
        >
          <p className="text-xs font-medium text-muted-foreground">
            FAQ {index + 1}
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`faq-question-${item.id}`}>Question</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.question.length} / 160
              </span>
            </div>
            <Input
              id={`faq-question-${item.id}`}
              maxLength={160}
              placeholder="What is your interview process like?"
              value={item.question}
              onChange={(event) =>
                updateItem(item.id, { question: event.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={`faq-answer-${item.id}`}>Answer</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.answer.length} / 800
              </span>
            </div>
            <Textarea
              id={`faq-answer-${item.id}`}
              maxLength={800}
              rows={3}
              placeholder="Answer"
              value={item.answer}
              onChange={(event) =>
                updateItem(item.id, { answer: event.target.value })
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Remove FAQ item ${index + 1}`}
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
        + Add FAQ
      </Button>
      {items.length >= MAX_ITEMS && (
        <p className="text-xs text-muted-foreground">
          FAQ supports up to {MAX_ITEMS} items.
        </p>
      )}
    </div>
  );
}
