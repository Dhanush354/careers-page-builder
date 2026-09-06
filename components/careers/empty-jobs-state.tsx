import { Button } from "@/components/ui/button";

export function EmptyJobsState({
  hasActiveFilters,
  onClearFilters,
}: {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="text-base font-medium text-foreground">
        {hasActiveFilters
          ? "No roles match these filters."
          : "No open roles right now — please check back soon."}
      </p>
      {hasActiveFilters && (
        <Button variant="outline" className="mt-5" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
