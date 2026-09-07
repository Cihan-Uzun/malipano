"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function createCariHareket(formData: FormData) {
  const officeId = await getOfficeId();
  const firmaId = String(formData.get("firmaId") || "");
  const tarih = String(formData.get("tarih") || "");
  const aciklama = String(formData.get("aciklama") || "").trim();
  const borc = Number(formData.get("borc") || 0);
  const alacak = Number(formData.get("alacak") || 0);
  if (!firmaId || !tarih || !aciklama) return;

  await prisma.cariHareket.create({
    data: {
      officeId,
      firmaId,
      tarih: new Date(tarih),
      aciklama,
      borc,
      alacak,
    },
  });
  revalidatePath("/cari");
}
