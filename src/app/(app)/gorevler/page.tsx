import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, GOREV_DURUM_LABELS } from "@/lib/utils";
import { createGorev, toggleGorev, createMesaj } from "@/app/actions/gorevler";

export default async function GorevlerPage() {
  const officeId = await getOfficeId();
  const [gorevler, firmalar, mesajlar] = await Promise.all([
    prisma.gorev.findMany({
      where: { officeId },
      include: { firma: true },
      orderBy: [{ durum: "asc" }, { sonTarih: "asc" }],
    }),
    prisma.firma.findMany({ where: { officeId }, orderBy: { unvan: "asc" } }),
    prisma.ofisMesaj.findMany({
      where: { officeId },
      include: { yazar: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div>
      <PageHeader title="Görevler & Ofis Panosu" description="Ekip işleri ve iç iletişim" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card title="Görev listesi">
            <ul className="space-y-3">
              {gorevler.map((gorev) => (
                <li
                  key={gorev.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <p className={`font-medium ${gorev.durum === "TAMAM" ? "text-slate-400 line-through" : "text-navy"}`}>
                      {gorev.baslik}
                    </p>
                    <p className="text-xs text-slate-500">
                      {gorev.firma?.unvan || "Genel"}
                      {gorev.sonTarih ? ` · ${formatDate(gorev.sonTarih)}` : ""}
                    </p>
                  </div>
                  <form action={toggleGorev}>
                    <input type="hidden" name="id" value={gorev.id} />
                    <input type="hidden" name="durum" value={gorev.durum} />
                    <button type="submit">
                      <StatusBadge
                        status={gorev.durum}
                        label={GOREV_DURUM_LABELS[gorev.durum]}
                      />
                    </button>
                  </form>
                </li>
              ))}
              {gorevler.length === 0 && (
                <p className="text-sm text-slate-500">Görev yok.</p>
              )}
            </ul>
          </Card>

          <Card title="Yeni görev">
            <form action={createGorev} className="space-y-3">
              <div>
                <label className="label">Başlık</label>
                <input name="baslik" required className="input" />
              </div>
              <div>
                <label className="label">Son tarih</label>
                <input name="sonTarih" type="date" className="input" />
              </div>
              <div>
                <label className="label">Firma</label>
                <select name="firmaId" className="input">
                  <option value="">Genel</option>
                  {firmalar.map((f) => (
                    <option key={f.id} value={f.id}>{f.unvan}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary">Ekle</button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Ofis panosu">
            <form action={createMesaj} className="mb-4 flex gap-2">
              <input name="icerik" required placeholder="Mesaj yazın..." className="input" />
              <button type="submit" className="btn-primary shrink-0">Gönder</button>
            </form>
            <ul className="space-y-3">
              {mesajlar.map((m) => (
                <li key={m.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                  <p className="text-slate-700">{m.icerik}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {m.yazar?.name || "Sistem"} · {formatDate(m.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
