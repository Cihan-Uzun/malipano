import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, MEVZUAT_KAYNAK_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "ALL", label: "Tümü" },
  { key: "RESMI_GAZETE", label: "Resmi Gazete" },
  { key: "GIB", label: "GİB" },
  { key: "SGK", label: "SGK" },
  { key: "SICIL", label: "Sicil" },
];

export default async function MevzuatPage({
  searchParams,
}: {
  searchParams: Promise<{ kaynak?: string; q?: string }>;
}) {
  const { kaynak, q } = await searchParams;
  const officeId = await getOfficeId();
  const active = kaynak || "ALL";

  const items = await prisma.mevzuat.findMany({
    where: {
      OR: [{ officeId: null }, { officeId }],
      ...(active !== "ALL" ? { kaynak: active } : {}),
      ...(q
        ? {
            OR: [
              { baslik: { contains: q } },
              { ozet: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { tarih: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Mevzuat"
        description="Resmi Gazete, GİB, SGK ve sicil duyuruları"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "ALL" ? "/mevzuat" : `/mevzuat?kaynak=${tab.key}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium",
              active === tab.key
                ? "bg-navy text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <form className="mb-6">
        {active !== "ALL" && <input type="hidden" name="kaynak" value={active} />}
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="Başlık veya özet ara..."
          className="input max-w-md"
        />
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge
                status="NORMAL"
                label={MEVZUAT_KAYNAK_LABELS[item.kaynak] || item.kaynak}
              />
              {item.yeni && (
                <span className="rounded-full bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal-700">
                  Yeni
                </span>
              )}
              {item.onem === "YUKSEK" && (
                <StatusBadge status="YUKSEK" label="Yüksek önem" />
              )}
              <span className="text-xs text-slate-400">{formatDate(item.tarih)}</span>
            </div>
            <h3 className="font-semibold text-navy">{item.baslik}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.ozet}</p>
          </article>
        ))}
        {items.length === 0 && (
          <p className="text-slate-500">Kayıt bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
