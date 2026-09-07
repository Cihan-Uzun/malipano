import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  title,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {title && (
            <h3 className="text-sm font-semibold text-navy">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "teal",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "teal" | "navy" | "amber" | "red";
}) {
  const accents = {
    teal: "border-l-teal",
    navy: "border-l-navy",
    amber: "border-l-amber-500",
    red: "border-l-red-500",
  };
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm",
        accents[accent]
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
