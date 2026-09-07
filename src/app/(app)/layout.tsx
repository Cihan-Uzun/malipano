import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const office = await prisma.office.findUnique({
    where: { id: session.user.officeId },
  });

  return (
    <AppShell
      userName={session.user.name || "Kullanıcı"}
      officeName={office?.name || "Ofis"}
    >
      {children}
    </AppShell>
  );
}
