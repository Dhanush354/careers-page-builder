export function OverviewCard({
  label,
  value,
  caption,
  icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
}: {
  label: string;
  value: string;
  caption: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      {icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}
