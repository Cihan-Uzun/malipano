import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { formatDate, formatTL } from "@/lib/utils";
import { OdemeForm } from "@/components/OdemeForm";

export default async function OdemeBildirimleriPage() {
  const officeId = await getOfficeId();
  const [bildirimler, firmalar] = await Promise.all([
    prisma.odemeBildirimi.findMany({
      where: { officeId },
      include: { firma: true, kalemler: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.firma.findMany({ where: { officeId }, orderBy: { unvan: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Ödeme Bildirimleri"
        description="Mükellefe ödeme özeti oluşturun"
      />

      {bildirimler.length === 0 ? (
        <EmptyState title="Henüz bildirim yok" description="Aşağıdan yeni bildirim oluşturun." />
      ) : (
        <div className="table-wrap mb-8">
          <table className="data-table">
            <thead>
              <tr>
                <th>Firma</th>
                <th>Dönem</th>
                <th>Kalem</th>
                <th>Toplam</th>
                <th>Tarih</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bildirimler.map((b) => {
                const total = b.kalemler.reduce((s, k) => s + k.tutar, 0);
                return (
                  <tr key={b.id}>
                    <td className="font-medium text-navy">{b.firma.unvan}</td>
                    <td>{b.donem}</td>
                    <td>{b.kalemler.length}</td>
                    <td className="font-medium">{formatTL(total)}</td>
                    <td>{formatDate(b.createdAt)}</td>
                    <td>
                      <Link
                        href={`/odeme-bildirimleri/${b.id}`}
                        className="text-sm font-medium text-teal hover:underline"
                      >
                        Görüntüle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-navy">Yeni ödeme bildirimi</h2>
        <OdemeForm firmalar={firmalar.map((f) => ({ id: f.id, unvan: f.unvan }))} />
      </div>
    </div>
  );
}
