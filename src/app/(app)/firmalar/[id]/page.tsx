import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { updateFirma, deleteFirma } from "@/app/actions/firmalar";
import { formatDate, formatTL } from "@/lib/utils";

export default async function FirmaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const officeId = await getOfficeId();
  const firma = await prisma.firma.findFirst({
    where: { id, officeId },
    include: {
      cariHareketler: { orderBy: { tarih: "desc" }, take: 10 },
      beyannameler: { orderBy: { sonTarih: "desc" }, take: 5 },
      tebligatlar: { orderBy: { tarih: "desc" }, take: 5 },
    },
  });
  if (!firma) notFound();

  const bakiye = firma.cariHareketler.reduce((s, h) => s + h.borc - h.alacak, 0);

  return (
    <div>
      <PageHeader
        title={firma.unvan}
        description={`VKN: ${firma.vkn}`}
        action={
          <Link href="/firmalar" className="btn-secondary">
            Listeye dön
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge status={firma.tip} label={firma.tip === "SAHIS" ? "Şahıs" : "Kurum"} />
        {firma.telefon && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {firma.telefon}
          </span>
        )}
        {firma.email && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {firma.email}
          </span>
        )}
        <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal-700">
          Cari bakiye: {formatTL(bakiye)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Firma bilgilerini düzenle">
          <form action={updateFirma} className="grid gap-3">
            <input type="hidden" name="id" value={firma.id} />
            <div>
              <label className="label">Unvan</label>
              <input name="unvan" defaultValue={firma.unvan} required className="input" />
            </div>
            <div>
              <label className="label">VKN</label>
              <input name="vkn" defaultValue={firma.vkn} required className="input" />
            </div>
            <div>
              <label className="label">Tip</label>
              <select name="tip" defaultValue={firma.tip} className="input">
                <option value="KURUM">Kurum</option>
                <option value="SAHIS">Şahıs</option>
              </select>
            </div>
            <div>
              <label className="label">Telefon</label>
              <input name="telefon" defaultValue={firma.telefon || ""} className="input" />
            </div>
            <div>
              <label className="label">E-posta</label>
              <input name="email" defaultValue={firma.email || ""} className="input" />
            </div>
            <div>
              <label className="label">Notlar</label>
              <textarea name="notlar" rows={2} defaultValue={firma.notlar || ""} className="input" />
            </div>
            <button type="submit" className="btn-primary">Güncelle</button>
          </form>
          <form action={deleteFirma} className="mt-4 border-t border-slate-100 pt-4">
            <input type="hidden" name="id" value={firma.id} />
            <button type="submit" className="btn-danger">Firmayı sil</button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card title="Son cari hareketler">
            <ul className="space-y-2 text-sm">
              {firma.cariHareketler.map((h) => (
                <li key={h.id} className="flex justify-between gap-2 border-b border-slate-50 pb-2">
                  <span>
                    <span className="text-slate-700">{h.aciklama}</span>
                    <span className="block text-xs text-slate-400">{formatDate(h.tarih)}</span>
                  </span>
                  <span className="text-right font-medium">
                    {h.borc > 0 && <span className="text-red-600">+{formatTL(h.borc)}</span>}
                    {h.alacak > 0 && <span className="text-emerald-600">-{formatTL(h.alacak)}</span>}
                  </span>
                </li>
              ))}
              {firma.cariHareketler.length === 0 && (
                <p className="text-slate-500">Hareket yok.</p>
              )}
            </ul>
          </Card>
          <Card title="Son tebligatlar">
            <ul className="space-y-2 text-sm">
              {firma.tebligatlar.map((t) => (
                <li key={t.id}>
                  <p className="font-medium text-navy">{t.konu}</p>
                  <p className="text-xs text-slate-400">{formatDate(t.tarih)}</p>
                </li>
              ))}
              {firma.tebligatlar.length === 0 && (
                <p className="text-slate-500">Tebligat yok.</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
