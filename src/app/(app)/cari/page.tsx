import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { formatDate, formatTL } from "@/lib/utils";
import { createCariHareket } from "@/app/actions/cari";
import Link from "next/link";

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<{ firmaId?: string }>;
}) {
  const { firmaId } = await searchParams;
  const officeId = await getOfficeId();
  const firmalar = await prisma.firma.findMany({
    where: { officeId },
    orderBy: { unvan: "asc" },
  });

  const selectedId = firmaId || firmalar[0]?.id;
  const hareketler = selectedId
    ? await prisma.cariHareket.findMany({
        where: { officeId, firmaId: selectedId },
        orderBy: { tarih: "desc" },
      })
    : [];

  const bakiye = hareketler.reduce((s, h) => s + h.borc - h.alacak, 0);
  const selected = firmalar.find((f) => f.id === selectedId);

  return (
    <div>
      <PageHeader title="Cari" description="Firma cari hareketleri" />

      <div className="mb-6 flex flex-wrap gap-2">
        {firmalar.map((f) => (
          <Link
            key={f.id}
            href={`/cari?firmaId=${f.id}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              f.id === selectedId
                ? "bg-teal text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.unvan}
          </Link>
        ))}
      </div>

      {selected ? (
        <>
          <div className="mb-4 rounded-xl border border-l-4 border-slate-200 border-l-teal bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-slate-500">{selected.unvan} bakiyesi</p>
            <p className="text-2xl font-bold text-navy">{formatTL(bakiye)}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Açıklama</th>
                      <th className="text-right">Borç</th>
                      <th className="text-right">Alacak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hareketler.map((h) => (
                      <tr key={h.id}>
                        <td>{formatDate(h.tarih)}</td>
                        <td>{h.aciklama}</td>
                        <td className="text-right text-red-600">
                          {h.borc ? formatTL(h.borc) : "—"}
                        </td>
                        <td className="text-right text-emerald-600">
                          {h.alacak ? formatTL(h.alacak) : "—"}
                        </td>
                      </tr>
                    ))}
                    {hareketler.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-slate-500">
                          Hareket yok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Card title="Hareket ekle">
              <form action={createCariHareket} className="space-y-3">
                <input type="hidden" name="firmaId" value={selected.id} />
                <div>
                  <label className="label">Tarih</label>
                  <input name="tarih" type="date" required className="input" />
                </div>
                <div>
                  <label className="label">Açıklama</label>
                  <input name="aciklama" required className="input" />
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
        </>
      ) : (
        <p className="text-slate-500">Önce bir firma ekleyin.</p>
      )}
    </div>
  );
}
