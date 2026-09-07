import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <Link href="/" className="mb-8">
        <Logo size="lg" />
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-navy">Giriş yap</h1>
        <p className="mb-6 text-sm text-slate-500">
          Muhasebe ofisin için tek panel
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
