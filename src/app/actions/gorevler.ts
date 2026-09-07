"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function createGorev(formData: FormData) {
  const officeId = await getOfficeId();
  const baslik = String(formData.get("baslik") || "").trim();
  const sonTarih = String(formData.get("sonTarih") || "");
  const firmaId = String(formData.get("firmaId") || "") || null;
  if (!baslik) return;

  await prisma.gorev.create({
    data: {
      officeId,
      baslik,
      firmaId: firmaId || null,
      sonTarih: sonTarih ? new Date(sonTarih) : null,
    },
  });
  revalidatePath("/gorevler");
  revalidatePath("/panel");
}

export async function toggleGorev(formData: FormData) {
  const officeId = await getOfficeId();
  const id = String(formData.get("id") || "");
  const durum = String(formData.get("durum") || "BEKLEYEN");
  const next = durum === "TAMAM" ? "BEKLEYEN" : "TAMAM";
  await prisma.gorev.updateMany({
    where: { id, officeId },
    data: { durum: next },
  });
  revalidatePath("/gorevler");
  revalidatePath("/panel");
}

export async function createMesaj(formData: FormData) {
  const officeId = await getOfficeId();
  const { auth } = await import("@/auth");
  const session = await auth();
  const icerik = String(formData.get("icerik") || "").trim();
  if (!icerik) return;

  await prisma.ofisMesaj.create({
    data: {
      officeId,
      icerik,
      yazarId: session?.user?.id,
    },
  });
  revalidatePath("/gorevler");
}
