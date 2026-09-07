"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOfficeId } from "@/lib/session";

export async function createFirma(formData: FormData) {
  const officeId = await getOfficeId();
  const unvan = String(formData.get("unvan") || "").trim();
  const vkn = String(formData.get("vkn") || "").trim();
  const tip = String(formData.get("tip") || "KURUM");
  const telefon = String(formData.get("telefon") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const notlar = String(formData.get("notlar") || "").trim() || null;

  if (!unvan || !vkn) return;

  await prisma.firma.create({
    data: { officeId, unvan, vkn, tip, telefon, email, notlar },
  });
  revalidatePath("/firmalar");
  redirect("/firmalar");
}

export async function updateFirma(formData: FormData) {
  const officeId = await getOfficeId();
  const id = String(formData.get("id") || "");
  const unvan = String(formData.get("unvan") || "").trim();
  const vkn = String(formData.get("vkn") || "").trim();
  const tip = String(formData.get("tip") || "KURUM");
  const telefon = String(formData.get("telefon") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const notlar = String(formData.get("notlar") || "").trim() || null;

  await prisma.firma.updateMany({
    where: { id, officeId },
    data: { unvan, vkn, tip, telefon, email, notlar },
  });
  revalidatePath("/firmalar");
  revalidatePath(`/firmalar/${id}`);
  redirect(`/firmalar/${id}`);
}

export async function deleteFirma(formData: FormData) {
  const officeId = await getOfficeId();
  const id = String(formData.get("id") || "");
  await prisma.firma.deleteMany({ where: { id, officeId } });
  revalidatePath("/firmalar");
  redirect("/firmalar");
}
