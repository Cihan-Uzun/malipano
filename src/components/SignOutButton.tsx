"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/giris" })}
      className="rounded-lg px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white"
    >
      Çıkış
    </button>
  );
}
