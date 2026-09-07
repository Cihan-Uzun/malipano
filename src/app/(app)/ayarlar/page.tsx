import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { formatDate } from "@/lib/utils";

export default async function AyarlarPage() {
  const session = await requireSession();
  const office = await prisma.office.findUnique({
    where: { id: session.user.officeId },
    include: { users: { select: { id: true, name: true, email: true, role: true } } },
  });

  return (
    <div>
      <PageHeader title="Ayarlar" description="Ofis ve hesap bilgileri" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Ofis">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Ofis adı</dt>
              <dd className="text-lg font-semibold text-navy">{office?.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Slug</dt>
              <dd className="font-mono text-slate-700">{office?.slug}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Oluşturulma</dt>
              <dd>{office ? formatDate(office.createdAt) : "—"}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Oturum">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Kullanıcı</dt>
              <dd className="font-semibold text-navy">{session.user.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">E-posta</dt>
              <dd>{session.user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Rol</dt>
              <dd>{session.user.role === "SAHIP" ? "Sahip" : "Personel"}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Kullanıcılar" className="lg:col-span-2">
          <div className="table-wrap !border-0 !shadow-none">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {office?.users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role === "SAHIP" ? "Sahip" : "Personel"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
