import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { formatDate } from "@/lib/utils";
import { createTebligat, markTebligatOkundu } from "@/app/actions/tebligat";

export default async function ETebligatPage() {
  const officeId = await getOfficeId();
  const [tebligatlar, firmalar] = await Promise.all([
    prisma.tebligat.findMany({
      where: { officeId },
      include: { firma: true },
      orderBy: { tarih: "desc" },
    }),
    prisma.firma.findMany({ where: { officeId }, orderBy: { unvan: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="e-Tebligat" description="Gelen kutusu ve manuel kayıt" />

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Bilgi:</strong> Canlı GİB e-Tebligat entegrasyonu yakında. Şimdilik
        tebligatları manuel ekleyebilirsiniz.
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Gelen kutusu">
            <ul className="divide-y divide-slate-100">
              {tebligatlar.map((item) => (
                <li key={item.id} className={`py-3 ${item.okundu ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-navy">
                        {!item.okundu && (
                          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal" />
                        )}
                        {item.konu}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.firma?.unvan || "Genel"} · {formatDate(item.tarih)}
                      </p>
                      {item.detay && (
                        <p className="mt-1 text-sm text-slate-600">{item.detay}</p>
                      )}
                    </div>
                    {!item.okundu && (
                      <form action={markTebligatOkundu}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="btn-secondary !py-1 !text-xs">
                          Okundu
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
              {tebligatlar.length === 0 && (
                <p className="py-4 text-sm text-slate-500">Tebligat yok.</p>
              )}
            </ul>
          </Card>
        </div>

        <Card title="Manuel tebligat ekle">
          <form action={createTebligat} className="space-y-3">
            <div>
              <label className="label">Konu</label>
              <input name="konu" required className="input" />
            </div>
            <div>
              <label className="label">Tarih</label>
              <input name="tarih" type="date" className="input" />
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
            <div>
              <label className="label">Detay</label>
              <textarea name="detay" rows={3} className="input" />
            </div>
            <button type="submit" className="btn-primary w-full">Ekle</button>
          </form>
        </Card>
      </div>
    </div>
  );
}
