import Link from "next/link";
import { Logo } from "@/components/Logo";

const features = [
  {
    title: "Firma & Mükellef Yönetimi",
    desc: "Tüm mükelleflerinizi tek listede tutun; VKN, iletişim ve notlarla düzenli çalışın.",
  },
  {
    title: "Beyanname Takibi",
    desc: "KDV, Muhtasar, geçici vergi ve e-Defter dönemlerini kartlarla izleyin.",
  },
  {
    title: "Görev & Ofis Panosu",
    desc: "Ekip görevlerini ve ofis mesajlarını aynı ekranda yönetin.",
  },
  {
    title: "Ödeme Bildirimleri",
    desc: "Mükellefe özel ödeme kalemleri oluşturup yazdırılabilir özet alın.",
  },
  {
    title: "Cari & Yevmiye",
    desc: "Firma carisi ve yevmiye kayıtlarını ofis bazında tutun.",
  },
  {
    title: "Mevzuat Akışı",
    desc: "Resmi Gazete, GİB ve SGK duyurularını filtreleyerek takip edin.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "1.490",
    desc: "Tek kişilik ofisler için",
    items: ["1 kullanıcı", "50 mükellef", "Temel beyanname takibi", "E-posta destek"],
  },
  {
    name: "Ofis",
    price: "3.490",
    desc: "Büyüyen SMMM ofisleri",
    items: ["5 kullanıcı", "250 mükellef", "Ödeme bildirimleri", "Cari & yevmiye", "Öncelikli destek"],
    featured: true,
  },
  {
    name: "Pro",
    price: "6.990",
    desc: "Çok şubeli yapılar",
    items: ["Sınırsız kullanıcı", "Sınırsız mükellef", "Gelişmiş raporlar", "API erişimi", "Özel onboarding"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo />
          <nav className="flex items-center gap-3">
            <Link href="/giris" className="btn-secondary !py-2">
              Giriş
            </Link>
            <Link href="/kayit" className="btn-primary !py-2">
              Ücretsiz dene
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-600 to-navy-800 text-white">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20% 20%, #0d9488 0, transparent 40%), radial-gradient(circle at 80% 0%, #14b8a6 0, transparent 35%)"}} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
          <p className="mb-4 inline-flex rounded-full bg-teal/20 px-3 py-1 text-xs font-semibold text-teal-200 ring-1 ring-teal-400/30">
            SMMM ofisleri için tasarlandı
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Muhasebe ofisin için{" "}
            <span className="text-teal-300">tek panel</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            MaliPano; firmalar, beyannameler, görevler, e-tebligat ve ödeme
            bildirimlerini tek bir çok kiracılı panelde birleştirir. Ofisinizi
            dakikalar içinde kurun.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kayit" className="btn-primary bg-teal text-base !px-6 !py-3">
              Ofisini oluştur
            </Link>
            <Link
              href="/giris"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
            >
              Demo ile giriş
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/50">
            Demo: demo@malipano.com / demo1234
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-navy">Ofis operasyonunuz tek yerde</h2>
          <p className="mt-3 text-slate-500">
            Günlük iş akışınız için temiz, hızlı ve Türkçe bir arayüz.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal/30 hover:shadow-md"
            >
              <div className="mb-4 h-10 w-10 rounded-xl bg-teal/10 text-center text-lg leading-10 text-teal">
                ◆
              </div>
              <h3 className="font-semibold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-navy">Şeffaf fiyatlandırma</h2>
            <p className="mt-3 text-slate-500">Aylık TL fiyatlar — KDV hariç</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                  p.featured
                    ? "border-teal ring-2 ring-teal/30"
                    : "border-slate-200"
                }`}
              >
                {p.featured && (
                  <span className="mb-3 inline-block rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                    Önerilen
                  </span>
                )}
                <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                <p className="text-sm text-slate-500">{p.desc}</p>
                <p className="mt-4">
                  <span className="text-3xl font-bold text-navy">{p.price}</span>
                  <span className="text-slate-500"> ₺/ay</span>
                </p>
                <ul className="mt-6 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-teal">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kayit"
                  className={`mt-6 block w-full text-center ${
                    p.featured ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <Logo size="sm" />
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} MaliPano — Muhasebe ofisin için tek panel
          </p>
        </div>
      </footer>
    </div>
  );
}
