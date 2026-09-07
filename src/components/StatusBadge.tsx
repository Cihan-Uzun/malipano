import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  HAZIR: "bg-blue-50 text-blue-700 ring-blue-600/20",
  ONAY_BEKLIYOR: "bg-amber-50 text-amber-700 ring-amber-600/20",
  TAMAM: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  GECIKMIS: "bg-red-50 text-red-700 ring-red-600/20",
  BEKLEYEN: "bg-slate-100 text-slate-700 ring-slate-500/20",
  SAHIS: "bg-purple-50 text-purple-700 ring-purple-600/20",
  KURUM: "bg-teal-50 text-teal-700 ring-teal-600/20",
  YUKSEK: "bg-red-50 text-red-700 ring-red-600/20",
  NORMAL: "bg-slate-100 text-slate-600 ring-slate-500/20",
  DUSUK: "bg-gray-50 text-gray-600 ring-gray-500/20",
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status] || "bg-slate-100 text-slate-700 ring-slate-500/20",
        className
      )}
    >
      {label || status}
    </span>
  );
}
