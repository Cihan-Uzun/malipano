"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export type ActionState = { error?: string; success?: boolean };

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "E-posta ve şifre zorunludur." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-posta veya şifre hatalı." };
    }
    throw error;
  }
  return { success: true };
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const officeName = String(formData.get("officeName") || "").trim();

  if (!name || !email || !password || !officeName) {
    return { error: "Tüm alanlar zorunludur." };
  }
  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalı." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Bu e-posta zaten kayıtlı." };
  }

  let slug = slugify(officeName);
  const slugExists = await prisma.office.findUnique({ where: { slug } });
  if (slugExists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.office.create({
    data: {
      name: officeName,
      slug,
      users: {
        create: {
          email,
          name,
          passwordHash,
          role: "SAHIP",
        },
      },
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/giris");
    }
    throw error;
  }
  return { success: true };
}
