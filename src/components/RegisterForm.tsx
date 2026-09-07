"use client";

import { useActionState } from "react";
import { registerAction, type ActionState } from "@/app/actions/auth";
import Link from "next/link";

const initial: ActionState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <label className="label" htmlFor="officeName">
          Ofis adı
        </label>
        <input
          id="officeName"
          name="officeName"
          required
          className="input"
          placeholder="Uzun Mali Müşavirlik"
        />
      </div>
      <div>
        <label className="label" htmlFor="name">
          Adınız
        </label>
        <input id="name" name="name" required className="input" placeholder="Cihan Uzun" />
      </div>
      <div>
        <label className="label" htmlFor="email">
          E-posta
        </label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="input"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Oluşturuluyor..." : "Ofisi oluştur"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-medium text-teal hover:underline">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
