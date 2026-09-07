"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function createTebligat(formData: FormData) {
  const officeId = await getOfficeId();
  const konu = String(formData.get("konu") || "").trim();
  const detay = String(formData.get("detay") || "").trim() || null;
  const firmaId = String(formData.get("firmaId") || "") || null;
  const tarih = String(formData.get("tarih") || "");
  if (!konu) return;

  await prisma.tebligat.create({
    data: {
      officeId,
      konu,
      detay,
      firmaId: firmaId || null,
      tarih: tarih ? new Date(tarih) : new Date(),
    },
  });
  revalidatePath("/e-tebligat");
  revalidatePath("/panel");
}

export async function markTebligatOkundu(formData: FormData) {
  const officeId = await getOfficeId();
  const id = String(formData.get("id") || "");
  await prisma.tebligat.updateMany({
    where: { id, officeId },
    data: { okundu: true },
  });
  revalidatePath("/e-tebligat");
}
