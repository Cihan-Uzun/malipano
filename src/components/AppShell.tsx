"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SignOutButton } from "./SignOutButton";
import { cn } from "@/lib/utils";
import { useState } from "react";

const nav = [
  { href: "/panel", label: "Panel", icon: "◫" },
  { href: "/firmalar", label: "Firmalar", icon: "▣" },
  { href: "/beyannameler", label: "Beyannameler", icon: "▤" },
  { href: "/gorevler", label: "Görevler", icon: "✓" },
  { href: "/e-tebligat", label: "e-Tebligat", icon: "✉" },
  { href: "/odeme-bildirimleri", label: "Ödeme Bildirimleri", icon: "₺" },
  { href: "/cari", label: "Cari", icon: "⇄" },
  { href: "/yevmiye", label: "Yevmiye", icon: "☰" },
  { href: "/mevzuat", label: "Mevzuat", icon: "§" },
  { href: "/ayarlar", label: "Ayarlar", icon: "⚙" },
];

export function AppShell({
  children,
  userName,
  officeName,
}: {
  children: React.ReactNode;
  userName: string;
  officeName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-navy text-white">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menü"
            >
              ☰
            </button>
            <Logo className="[&_span]:text-white [&_.text-teal]:text-teal-300" />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-white/70 sm:inline">{officeName}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
              {userName}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white pt-14 transition-transform lg:static lg:translate-x-0 lg:pt-0",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-teal/10 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                  )}
                >
                  <span className="w-5 text-center opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
