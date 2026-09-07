import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.officeId) {
    redirect("/giris");
  }
  return session;
}

export async function getOfficeId() {
  const session = await requireSession();
  return session.user.officeId;
}
