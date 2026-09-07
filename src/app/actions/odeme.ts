"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function createOdemeBildirimi(formData: FormData) {
  const officeId = await getOfficeId();
  const firmaId = String(formData.get("firmaId") || "");
  const donem = String(formData.get("donem") || "").trim();
  const not = String(formData.get("not") || "").trim() || null;
  if (!firmaId || !donem) return;

  const turler = formData.getAll("tur") as string[];
  const tutarlar = formData.getAll("tutar") as string[];
  const sonTarihler = formData.getAll("kalemSonTarih") as string[];
  const kalemNotlar = formData.getAll("kalemNot") as string[];

  const kalemler = turler
    .map((tur, i) => ({
      tur: tur.trim(),
      tutar: Number(tutarlar[i] || 0),
      sonTarih: sonTarihler[i] ? new Date(sonTarihler[i]) : null,
      not: (kalemNotlar[i] || "").trim() || null,
    }))
    .filter((k) => k.tur && k.tutar > 0);

  const bildirim = await prisma.odemeBildirimi.create({
    data: {
      officeId,
      firmaId,
      donem,
      not,
      kalemler: { create: kalemler },
    },
  });

  revalidatePath("/odeme-bildirimleri");
  redirect(`/odeme-bildirimleri/${bildirim.id}`);
}
