# MaliPano

**Muhasebe ofisin icin tek panel**

Turk SMMM ofisleri icin cok kiracili SaaS paneli.

## Kurulum

1. `cp .env.example .env`
2. `npm install`
3. `npx prisma db push`
4. `npm run seed`
5. `npm run dev`

http://localhost:3000

## Demo hesap

- E-posta: `demo@malipano.com`
- Sifre: `demo1234`
- Ofis: Demo Mali Musavirlik

## Ortam

`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` — bkz. `.env.example`

## Marka

- Navy `#0f2744` / Teal `#0d9488`

## Vercel yayını

Vercel'de kalıcı dosya sistemi olmadığından üretimde Turso kullanılır.
Yerel SQLite desteği korunur: `TURSO_DATABASE_URL` tanımlı değilse
`DATABASE_URL` kullanılır. Turso tanımlıysa aynı Prisma modelleri uzak
SQLite veritabanına bağlanır.

1. Vercel projesine Turso Starter (ücretsiz) entegrasyonunu bağlayın.
2. Entegrasyon `TURSO_DATABASE_URL` ve `TURSO_AUTH_TOKEN` değişkenlerini sağlar.
3. Üretim ortamına rastgele, güçlü bir `AUTH_SECRET` ekleyin.
   Prisma şema ayarı için `DATABASE_URL=file:./dev.db` tanımlayın;
   Turso bağlantısı etkin olduğunda bu yerel dosyaya veri yazılmaz.
4. `vercel env pull .env.local` ile geliştirme bağlantısını alın.
5. Yalnızca yeni ve boş veritabanında `npm run db:turso:init` çalıştırın.
   SQL, mevcut `prisma/schema.prisma` dosyasından üretilmiştir.
6. Demo isteniyorsa boş ofis veritabanına bir kez `npm run db:turso:seed`
   uygulayın. Uzak veritabanında ofis varsa bu komut veri silmeden durur.
7. `npm run build` ve `vercel --prod` ile yayınlayın.

`AUTH_URL` Vercel'de zorunlu değildir; otomatik alan adı tespiti kullanılır.
Üretime `http://localhost:3000` değerini taşımayın. Veritabanı kurulumu
ve demo verileri her derlemede yeniden çalıştırılmaz.

Demo hesabı herkese açıktır; gerçek ofis verileri için `/kayit` üzerinden
ayrı bir hesap oluşturun. `.env*`, veritabanı dosyaları ve `.vercel`
kimlik bilgilerini kaynak kontrolüne eklemeyin.
