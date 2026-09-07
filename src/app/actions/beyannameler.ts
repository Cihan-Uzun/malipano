"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function updateBeyannameDurum(formData: FormData) {
  const officeId = await getOfficeId();
  const id = String(formData.get("id") || "");
  const durum = String(formData.get("durum") || "");
  let tamamlanan = Number(formData.get("tamamlanan") || 0);
  const toplam = Number(formData.get("toplam") || 1);

  if (durum === "TAMAM") tamamlanan = toplam;

  await prisma.beyanname.updateMany({
    where: { id, officeId },
    data: { durum, tamamlanan },
  });
  revalidatePath("/beyannameler");
  revalidatePath("/panel");
}

export async function createBeyanname(formData: FormData) {
  const officeId = await getOfficeId();
  const tip = String(formData.get("tip") || "KDV");
  const donem = String(formData.get("donem") || "").trim();
  const sonTarih = String(formData.get("sonTarih") || "");
  const firmaId = String(formData.get("firmaId") || "") || null;
  const toplam = Number(formData.get("toplam") || 1);

  if (!donem || !sonTarih) return;

  await prisma.beyanname.create({
    data: {
      officeId,
      tip,
      donem,
      sonTarih: new Date(sonTarih),
      firmaId: firmaId || null,
      toplam,
      tamamlanan: 0,
      durum: "HAZIR",
    },
  });
  revalidatePath("/beyannameler");
  revalidatePath("/panel");
}
