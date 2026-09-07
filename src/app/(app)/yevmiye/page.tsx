import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { formatDate, formatTL } from "@/lib/utils";
import { createYevmiye } from "@/app/actions/yevmiye";

export default async function YevmiyePage() {
  const officeId = await getOfficeId();
  const kayitlar = await prisma.yevmiye.findMany({
    where: { officeId },
    orderBy: { tarih: "desc" },
  });

  return (
    <div>
      <PageHeader title="Yevmiye" description="Ofis yevmiye defteri kayıtları" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Evrak</th>
                  <th>Hesap</th>
                  <th>Açıklama</th>
                  <th className="text-right">Borç</th>
                  <th className="text-right">Alacak</th>
                </tr>
              </thead>
              <tbody>
                {kayitlar.map((k) => (
                  <tr key={k.id}>
                    <td>{formatDate(k.tarih)}</td>
                    <td className="font-mono text-xs">{k.evrakNo || "—"}</td>
                    <td className="font-medium">{k.hesap}</td>
                    <td className="max-w-[200px] truncate">{k.aciklama || "—"}</td>
                    <td className="text-right">{k.borc ? formatTL(k.borc) : "—"}</td>
                    <td className="text-right">{k.alacak ? formatTL(k.alacak) : "—"}</td>
                  </tr>
                ))}
                {kayitlar.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-slate-500">Kayıt yok.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Card title="Yevmiye ekle">
          <form action={createYevmiye} className="space-y-3">
            <div>
              <label className="label">Tarih</label>
              <input name="tarih" type="date" required className="input" />
            </div>
            <div>
              <label className="label">Evrak no</label>
              <input name="evrakNo" className="input" />
            </div>
            <div>
              <label className="label">Hesap</label>
              <input name="hesap" required placeholder="100.01 Kasa" className="input" />
            </div>
            <div>
              <label className="label">Açıklama</label>
              <input name="aciklama" className="input" />
            </div>
            <div>
              <label className="label">Borç</label>
              <input name="borc" type="number" step="0.01" defaultValue={0} className="input" />
            </div>
            <div>
              <label className="label">Alacak</label>
              <input name="alacak" type="number" step="0.01" defaultValue={0} className="input" />
            </div>
            <button type="submit" className="btn-primary w-full">Ekle</button>
          </form>
        </Card>
      </div>
    </div>
  );
}
