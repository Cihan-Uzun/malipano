import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  BEYANNAME_DURUM_LABELS,
  BEYANNAME_TIP_LABELS,
  formatDate,
} from "@/lib/utils";
import { createBeyanname, updateBeyannameDurum } from "@/app/actions/beyannameler";

export default async function BeyannamelerPage() {
  const officeId = await getOfficeId();
  const [beyannameler, firmalar] = await Promise.all([
    prisma.beyanname.findMany({
      where: { officeId },
      include: { firma: true },
      orderBy: { sonTarih: "asc" },
    }),
    prisma.firma.findMany({ where: { officeId }, orderBy: { unvan: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="Beyannameler" description="Dönem ve durum takibi" />

      {beyannameler.length === 0 ? (
        <EmptyState title="Beyanname kaydı yok" />
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {beyannameler.map((item) => {
            const pct = item.toplam
              ? Math.round((item.tamamlanan / item.toplam) * 100)
              : 0;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-navy">
                      {BEYANNAME_TIP_LABELS[item.tip] || item.tip}
                    </h3>
                    <p className="text-sm text-slate-500">{item.donem}</p>
                  </div>
                  <StatusBadge
                    status={item.durum}
                    label={BEYANNAME_DURUM_LABELS[item.durum] || item.durum}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {item.firma?.unvan || "Ofis geneli"} · Son: {formatDate(item.sonTarih)}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {item.tamamlanan}/{item.toplam} tamamlandı
                </p>
                <form action={updateBeyannameDurum} className="mt-4 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="toplam" value={item.toplam} />
                  <input type="hidden" name="tamamlanan" value={item.tamamlanan} />
                  <select name="durum" defaultValue={item.durum} className="input !w-auto !py-1.5 text-xs">
                    {Object.entries(BEYANNAME_DURUM_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn-secondary !py-1.5 !text-xs">
                    Güncelle
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-navy">Yeni beyanname</h2>
        <form action={createBeyanname} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="label">Tip</label>
            <select name="tip" className="input">
              {Object.entries(BEYANNAME_TIP_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Dönem</label>
            <input name="donem" required placeholder="2026/08" className="input" />
          </div>
          <div>
            <label className="label">Son tarih</label>
            <input name="sonTarih" type="date" required className="input" />
          </div>
          <div>
            <label className="label">Firma (opsiyonel)</label>
            <select name="firmaId" className="input">
              <option value="">Ofis geneli</option>
              {firmalar.map((f) => (
                <option key={f.id} value={f.id}>{f.unvan}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Toplam adet</label>
            <input name="toplam" type="number" min={1} defaultValue={1} className="input" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary">Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
