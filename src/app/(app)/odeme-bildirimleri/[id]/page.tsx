import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { formatDate, formatTL } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { PrintButton } from "@/components/PrintButton";

export default async function OdemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const officeId = await getOfficeId();
  const bildirim = await prisma.odemeBildirimi.findFirst({
    where: { id, officeId },
    include: {
      firma: true,
      kalemler: true,
      office: true,
    },
  });
  if (!bildirim) notFound();

  const total = bildirim.kalemler.reduce((s, k) => s + k.tutar, 0);

  return (
    <div>
      <div className="mb-4 flex gap-2 print:hidden">
        <Link href="/odeme-bildirimleri" className="btn-secondary">
          Geri
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-slate-500">{bildirim.office.name}</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p className="font-semibold text-navy">Ödeme Bildirimi</p>
            <p>Dönem: {bildirim.donem}</p>
            <p>{formatDate(bildirim.createdAt)}</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Mükellef</p>
          <p className="text-lg font-semibold text-navy">{bildirim.firma.unvan}</p>
          <p className="text-sm text-slate-500">VKN: {bildirim.firma.vkn}</p>
        </div>

        {bildirim.not && (
          <p className="mb-4 text-sm text-slate-600">{bildirim.not}</p>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 font-medium">Tür</th>
              <th className="py-2 font-medium">Son tarih</th>
              <th className="py-2 font-medium">Not</th>
              <th className="py-2 text-right font-medium">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {bildirim.kalemler.map((k) => (
              <tr key={k.id} className="border-b border-slate-50">
                <td className="py-3 font-medium text-navy">{k.tur}</td>
                <td className="py-3 text-slate-500">
                  {k.sonTarih ? formatDate(k.sonTarih) : "—"}
                </td>
                <td className="py-3 text-slate-500">{k.not || "—"}</td>
                <td className="py-3 text-right font-medium">{formatTL(k.tutar)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-4 text-right font-semibold text-navy">
                Toplam
              </td>
              <td className="pt-4 text-right text-lg font-bold text-teal">
                {formatTL(total)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-10 text-center text-xs text-slate-400">
          Bu belge MaliPano üzerinden oluşturulmuştur.
        </p>
      </div>
    </div>
  );
}
