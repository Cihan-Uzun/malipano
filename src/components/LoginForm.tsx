"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/auth";
import Link from "next/link";

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          placeholder="ornek@ofis.com"
          defaultValue="demo@malipano.com"
        />
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
          className="input"
          defaultValue="demo1234"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-medium text-teal hover:underline">
          Kayıt olun
        </Link>
      </p>
    </form>
  );
}
