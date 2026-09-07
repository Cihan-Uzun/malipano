import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { createFirma } from "@/app/actions/firmalar";

export default async function FirmalarPage() {
  const officeId = await getOfficeId();
  const firmalar = await prisma.firma.findMany({
    where: { officeId },
    orderBy: { unvan: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Firmalar"
        description="Mükellef / firma listesi"
        action={
          <a href="#yeni" className="btn-primary">
            Yeni firma
          </a>
        }
      />

      {firmalar.length === 0 ? (
        <EmptyState title="Henüz firma yok" description="İlk mükellefinizi ekleyin." />
      ) : (
        <div className="table-wrap mb-8">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unvan</th>
                <th>VKN</th>
                <th>Tip</th>
                <th>Telefon</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {firmalar.map((f) => (
                <tr key={f.id}>
                  <td className="font-medium text-navy">{f.unvan}</td>
                  <td className="font-mono text-xs">{f.vkn}</td>
                  <td>
                    <StatusBadge status={f.tip} label={f.tip === "SAHIS" ? "Şahıs" : "Kurum"} />
                  </td>
                  <td>{f.telefon || "—"}</td>
                  <td>
                    <Link href={`/firmalar/${f.id}`} className="text-sm font-medium text-teal hover:underline">
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div id="yeni" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-navy">Yeni firma ekle</h2>
        <form action={createFirma} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Unvan</label>
            <input name="unvan" required className="input" />
          </div>
          <div>
            <label className="label">VKN / TCKN</label>
            <input name="vkn" required className="input" />
          </div>
          <div>
            <label className="label">Tip</label>
            <select name="tip" className="input">
              <option value="KURUM">Kurum</option>
              <option value="SAHIS">Şahıs</option>
            </select>
          </div>
          <div>
            <label className="label">Telefon</label>
            <input name="telefon" className="input" />
          </div>
          <div>
            <label className="label">E-posta</label>
            <input name="email" type="email" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Notlar</label>
            <textarea name="notlar" rows={2} className="input" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}
