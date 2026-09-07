"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function createYevmiye(formData: FormData) {
  const officeId = await getOfficeId();
  const tarih = String(formData.get("tarih") || "");
  const evrakNo = String(formData.get("evrakNo") || "").trim() || null;
  const hesap = String(formData.get("hesap") || "").trim();
  const borc = Number(formData.get("borc") || 0);
  const alacak = Number(formData.get("alacak") || 0);
  const aciklama = String(formData.get("aciklama") || "").trim() || null;
  if (!tarih || !hesap) return;

  await prisma.yevmiye.create({
    data: { officeId, tarih: new Date(tarih), evrakNo, hesap, borc, alacak, aciklama },
  });
  revalidatePath("/yevmiye");
}
