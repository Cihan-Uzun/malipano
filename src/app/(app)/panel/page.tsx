import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card, StatCard } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import {
  BEYANNAME_DURUM_LABELS,
  BEYANNAME_TIP_LABELS,
  formatDate,
} from "@/lib/utils";

export default async function PanelPage() {
  const officeId = await getOfficeId();
  const now = new Date();

  const [
    firmaCount,
    gorevBekleyen,
    tebligatOkunmamis,
    beyannameler,
    yaklasanGorevler,
    sonMesajlar,
  ] = await Promise.all([
    prisma.firma.count({ where: { officeId } }),
    prisma.gorev.count({ where: { officeId, durum: "BEKLEYEN" } }),
    prisma.tebligat.count({ where: { officeId, okundu: false } }),
    prisma.beyanname.findMany({
      where: { officeId },
      include: { firma: true },
      orderBy: { sonTarih: "asc" },
      take: 8,
    }),
    prisma.gorev.findMany({
      where: { officeId, durum: "BEKLEYEN" },
      include: { firma: true },
      orderBy: { sonTarih: "asc" },
      take: 5,
    }),
    prisma.ofisMesaj.findMany({
      where: { officeId },
      include: { yazar: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const gecikmis = beyannameler.filter(
    (b) => b.durum === "GECIKMIS" || (b.sonTarih < now && b.durum !== "TAMAM")
  ).length;

  return (
    <div>
      <PageHeader
        title="Panel"
        description="Ofis özeti ve yaklaşan son tarihler"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Mükellef" value={firmaCount} accent="navy" />
        <StatCard label="Bekleyen görev" value={gorevBekleyen} accent="amber" />
        <StatCard label="Okunmamış tebligat" value={tebligatOkunmamis} accent="teal" />
        <StatCard label="Geciken beyanname" value={gecikmis} accent="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Beyanname kartları"
            action={
              <Link href="/beyannameler" className="text-sm font-medium text-teal hover:underline">
                Tümü
              </Link>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {beyannameler.map((b) => {
                const pct = b.toplam ? Math.round((b.tamamlanan / b.toplam) * 100) : 0;
                return (
                  <div
                    key={b.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-navy">
                          {BEYANNAME_TIP_LABELS[b.tip] || b.tip}
                        </p>
                        <p className="text-xs text-slate-500">{b.donem}</p>
                      </div>
                      <StatusBadge
                        status={b.durum}
                        label={BEYANNAME_DURUM_LABELS[b.durum] || b.durum}
                      />
                    </div>
                    <p className="mt-2 truncate text-xs text-slate-500">
                      {b.firma?.unvan || "Ofis geneli"}
                    </p>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>
                          {b.tamamlanan}/{b.toplam}
                        </span>
                        <span>Son: {formatDate(b.sonTarih)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {beyannameler.length === 0 && (
                <p className="col-span-2 text-sm text-slate-500">Henüz beyanname yok.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Yaklaşan görevler">
            <ul className="space-y-3">
              {yaklasanGorevler.map((g) => (
                <li key={g.id} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-navy">{g.baslik}</p>
                  <p className="text-xs text-slate-500">
                    {g.firma?.unvan || "Genel"}
                    {g.sonTarih ? ` · ${formatDate(g.sonTarih)}` : ""}
                  </p>
                </li>
              ))}
              {yaklasanGorevler.length === 0 && (
                <p className="text-sm text-slate-500">Bekleyen görev yok.</p>
              )}
            </ul>
          </Card>

          <Card
            title="Ofis panosu"
            action={
              <Link href="/gorevler" className="text-sm font-medium text-teal hover:underline">
                Aç
              </Link>
            }
          >
            <ul className="space-y-3">
              {sonMesajlar.map((m) => (
                <li key={m.id} className="text-sm">
                  <p className="text-slate-700">{m.icerik}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {m.yazar?.name || "Sistem"} · {formatDate(m.createdAt)}
                  </p>
                </li>
              ))}
              {sonMesajlar.length === 0 && (
                <p className="text-sm text-slate-500">Henüz mesaj yok.</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
