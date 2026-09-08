import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  if (process.env.TURSO_DATABASE_URL && (await prisma.office.count()) > 0) {
    throw new Error("Uzak veritabanı boş değil; demo kurulumu mevcut verileri silemez.");
  }
  await prisma.odemeKalemi.deleteMany();
  await prisma.odemeBildirimi.deleteMany();
  await prisma.cariHareket.deleteMany();
  await prisma.yevmiye.deleteMany();
  await prisma.tebligat.deleteMany();
  await prisma.ofisMesaj.deleteMany();
  await prisma.gorev.deleteMany();
  await prisma.beyanname.deleteMany();
  await prisma.mevzuat.deleteMany();
  await prisma.firma.deleteMany();
  await prisma.user.deleteMany();
  await prisma.office.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const office = await prisma.office.create({
    data: {
      name: "Demo Mali Müşavirlik",
      slug: "demo-mali-musavirlik",
      users: {
        create: {
          email: "demo@malipano.com",
          name: "Demo Kullanıcı",
          passwordHash,
          role: "SAHIP",
        },
      },
    },
    include: { users: true },
  });

  const userId = office.users[0].id;

  const firmaData = [
    { unvan: "Anadolu Tekstil A.Ş.", vkn: "1234567890", tip: "KURUM", telefon: "0212 555 0101", email: "muhasebe@anadolutekstil.com", notlar: "Aylık KDV + Muhtasar" },
    { unvan: "Boğaziçi Yazılım Ltd. Şti.", vkn: "2345678901", tip: "KURUM", telefon: "0216 444 0202", email: "info@bogaziciyazilim.com", notlar: "e-Defter mükellefi" },
    { unvan: "Ege Gıda Sanayi A.Ş.", vkn: "3456789012", tip: "KURUM", telefon: "0232 333 0303", email: "finans@egegida.com" },
    { unvan: "Mehmet Yılmaz", vkn: "12345678901", tip: "SAHIS", telefon: "0532 111 2233", email: "mehmet@yilmaz.com", notlar: "Serbest meslek" },
    { unvan: "Karadeniz Lojistik A.Ş.", vkn: "4567890123", tip: "KURUM", telefon: "0462 222 0404", email: "cari@karadenizlojistik.com" },
    { unvan: "Ayşe Demir Danışmanlık", vkn: "98765432109", tip: "SAHIS", telefon: "0533 444 5566", email: "ayse@demirdanismanlik.com" },
    { unvan: "İstanbul İnşaat Taahhüt Ltd.", vkn: "5678901234", tip: "KURUM", telefon: "0212 777 0505", email: "ofis@istanbuinsaat.com", notlar: "Geçici vergi + KDV" },
  ];

  const firmalar = [];
  for (const f of firmaData) {
    firmalar.push(await prisma.firma.create({ data: { ...f, officeId: office.id } }));
  }

  const d = (y: number, m: number, day: number) => new Date(Date.UTC(y, m - 1, day));

  await prisma.beyanname.createMany({
    data: [
      { officeId: office.id, tip: "KDV", donem: "2026/08", sonTarih: d(2026, 9, 26), durum: "HAZIR", tamamlanan: 3, toplam: 7 },
      { officeId: office.id, tip: "MUHSGK", donem: "2026/08", sonTarih: d(2026, 9, 26), durum: "ONAY_BEKLIYOR", tamamlanan: 5, toplam: 7 },
      { officeId: office.id, tip: "GECICI_VERGI", donem: "2026/Q2", sonTarih: d(2026, 8, 17), durum: "TAMAM", tamamlanan: 4, toplam: 4 },
      { officeId: office.id, tip: "E_DEFTER", donem: "2026/07", sonTarih: d(2026, 9, 10), durum: "GECIKMIS", tamamlanan: 1, toplam: 3, firmaId: firmalar[1].id },
      { officeId: office.id, tip: "KDV", donem: "2026/07", sonTarih: d(2026, 8, 26), durum: "TAMAM", tamamlanan: 7, toplam: 7 },
      { officeId: office.id, tip: "DIGER", donem: "2026/08", sonTarih: d(2026, 9, 30), durum: "HAZIR", tamamlanan: 0, toplam: 2, firmaId: firmalar[0].id },
    ],
  });

  await prisma.gorev.createMany({
    data: [
      { officeId: office.id, baslik: "Anadolu Tekstil Ağustos KDV hazırla", sonTarih: d(2026, 9, 20), durum: "BEKLEYEN", firmaId: firmalar[0].id },
      { officeId: office.id, baslik: "Boğaziçi e-Defter berat yükle", sonTarih: d(2026, 9, 8), durum: "BEKLEYEN", firmaId: firmalar[1].id },
      { officeId: office.id, baslik: "SGK prim ödemelerini kontrol et", sonTarih: d(2026, 9, 15), durum: "BEKLEYEN" },
      { officeId: office.id, baslik: "Karadeniz Lojistik cari mutabakat", sonTarih: d(2026, 9, 12), durum: "BEKLEYEN", firmaId: firmalar[4].id },
      { officeId: office.id, baslik: "Temmuz geçici vergi arşivle", durum: "TAMAM", firmaId: firmalar[6].id },
      { officeId: office.id, baslik: "Yeni mükellef evrak klasörü oluştur", durum: "BEKLEYEN", firmaId: firmalar[5].id },
    ],
  });

  await prisma.ofisMesaj.createMany({
    data: [
      { officeId: office.id, yazarId: userId, icerik: "Bu hafta KDV son günü Cuma — lütfen kartları güncelleyin." },
      { officeId: office.id, yazarId: userId, icerik: "Demo ofis panosu aktif. Mesajlar buraya düşer." },
      { officeId: office.id, yazarId: userId, icerik: "Ege Gıda için ödeme bildirimi hazırlandı, yazdırıp iletebilirsiniz." },
    ],
  });

  await prisma.tebligat.createMany({
    data: [
      { officeId: office.id, firmaId: firmalar[0].id, konu: "KDV iadesi ek bilgi talebi", tarih: d(2026, 9, 1), okundu: false, detay: "2025/11 dönemi için ek belge isteniyor." },
      { officeId: office.id, firmaId: firmalar[2].id, konu: "Vergi inceleme ön bildirimi", tarih: d(2026, 8, 28), okundu: false, detay: "Maliye tarafından ön bildirim." },
      { officeId: office.id, firmaId: firmalar[1].id, konu: "e-Defter uyumsuzluk uyarısı", tarih: d(2026, 8, 20), okundu: true, detay: "Temmuz beratı gecikmeli." },
      { officeId: office.id, konu: "GİB sistem bakım duyurusu", tarih: d(2026, 9, 3), okundu: false, detay: "Pazar 02:00-06:00 bakım." },
    ],
  });

  const bildirim = await prisma.odemeBildirimi.create({
    data: {
      officeId: office.id,
      firmaId: firmalar[2].id,
      donem: "2026/08",
      not: "Ağustos dönemi ödeme özeti — lütfen son tarihlere dikkat edin.",
      kalemler: {
        create: [
          { tur: "KDV", tutar: 48500, sonTarih: d(2026, 9, 26), not: "1 no.lu KDV" },
          { tur: "Muhtasar + SGK", tutar: 22340, sonTarih: d(2026, 9, 26) },
          { tur: "SGK", tutar: 18750, sonTarih: d(2026, 9, 30), not: "İşveren primi" },
          { tur: "Muhasebe ücreti", tutar: 8500, sonTarih: d(2026, 9, 15) },
          { tur: "Bağ-Kur", tutar: 6200, sonTarih: d(2026, 9, 30) },
        ],
      },
    },
  });
  void bildirim;

  await prisma.cariHareket.createMany({
    data: [
      { officeId: office.id, firmaId: firmalar[0].id, tarih: d(2026, 8, 5), aciklama: "Temmuz muhasebe ücreti", borc: 7500, alacak: 0 },
      { officeId: office.id, firmaId: firmalar[0].id, tarih: d(2026, 8, 12), aciklama: "Havale tahsilat", borc: 0, alacak: 7500 },
      { officeId: office.id, firmaId: firmalar[0].id, tarih: d(2026, 9, 1), aciklama: "Ağustos muhasebe ücreti", borc: 7500, alacak: 0 },
      { officeId: office.id, firmaId: firmalar[2].id, tarih: d(2026, 8, 10), aciklama: "Danışmanlık faturası", borc: 12000, alacak: 0 },
      { officeId: office.id, firmaId: firmalar[2].id, tarih: d(2026, 8, 25), aciklama: "Kısmi tahsilat", borc: 0, alacak: 5000 },
      { officeId: office.id, firmaId: firmalar[4].id, tarih: d(2026, 7, 20), aciklama: "Açılış bakiyesi", borc: 15000, alacak: 0 },
      { officeId: office.id, firmaId: firmalar[4].id, tarih: d(2026, 8, 18), aciklama: "Ödeme", borc: 0, alacak: 10000 },
    ],
  });

  await prisma.yevmiye.createMany({
    data: [
      { officeId: office.id, tarih: d(2026, 9, 1), evrakNo: "2026/0891", hesap: "100.01 Kasa", borc: 25000, alacak: 0, aciklama: "Nakit tahsilat" },
      { officeId: office.id, tarih: d(2026, 9, 1), evrakNo: "2026/0891", hesap: "120.01 Alıcılar", borc: 0, alacak: 25000, aciklama: "Nakit tahsilat karşılığı" },
      { officeId: office.id, tarih: d(2026, 9, 2), evrakNo: "2026/0892", hesap: "770.01 Genel yönetim", borc: 3500, alacak: 0, aciklama: "Ofis kirası payı" },
      { officeId: office.id, tarih: d(2026, 9, 2), evrakNo: "2026/0892", hesap: "102.01 Bankalar", borc: 0, alacak: 3500, aciklama: "Kira ödemesi" },
      { officeId: office.id, tarih: d(2026, 9, 3), evrakNo: "2026/0893", hesap: "191.01 İndirilecek KDV", borc: 700, alacak: 0, aciklama: "Alış faturası KDV" },
      { officeId: office.id, tarih: d(2026, 9, 3), evrakNo: "2026/0893", hesap: "320.01 Satıcılar", borc: 0, alacak: 4200, aciklama: "Kırtasiye alımı" },
      { officeId: office.id, tarih: d(2026, 9, 3), evrakNo: "2026/0893", hesap: "760.01 Pazarlama", borc: 3500, alacak: 0, aciklama: "Kırtasiye (matrah)" },
    ],
  });

  await prisma.mevzuat.createMany({
    data: [
      { officeId: null, kaynak: "RESMI_GAZETE", baslik: "Katma Değer Vergisi Genel Uygulama Tebliği’nde değişiklik", ozet: "İade süreçlerinde ek belge listesi güncellendi. Ofislerin iade dosyalarını yeni listeye göre kontrol etmesi önerilir.", tarih: d(2026, 9, 2), onem: "YUKSEK", yeni: true },
      { officeId: null, kaynak: "GIB", baslik: "e-Defter berat gönderim takvimi hatırlatması", ozet: "Temmuz 2026 dönem beratlarının son gönderim tarihi yaklaşıyor. Gecikme cezasına dikkat.", tarih: d(2026, 8, 30), onem: "YUKSEK", yeni: true },
      { officeId: null, kaynak: "SGK", baslik: "Ağustos ayı prim ödeme süreleri", ozet: "İşveren primlerinin son ödeme günü ayın son iş günüdür. Banka kesintilerini önceden planlayın.", tarih: d(2026, 8, 25), onem: "NORMAL", yeni: true },
      { officeId: null, kaynak: "SICIL", baslik: "Ticaret sicili elektronik tebligat zorunluluğu", ozet: "Anonim ve limited şirketlerde MERSİS üzerinden elektronik tebligat adres teyidi hatırlatıldı.", tarih: d(2026, 8, 15), onem: "NORMAL", yeni: false },
      { officeId: office.id, kaynak: "GIB", baslik: "Ofis notu: Demo mükellefler için KDV kontrol listesi", ozet: "Demo Mali Müşavirlik iç kullanım — Ağustos KDV kontrol maddeleri ofis panosuna eklendi.", tarih: d(2026, 9, 4), onem: "DUSUK", yeni: true },
      { officeId: null, kaynak: "RESMI_GAZETE", baslik: "Asgari ücret destek ödemesi duyurusu", ozet: "Belirli sektörlerde asgari ücret desteği başvuru koşulları yayımlandı.", tarih: d(2026, 7, 28), onem: "NORMAL", yeni: false },
    ],
  });

  console.log("Seed tamamlandı: Demo Mali Müşavirlik");
  console.log("Giriş: demo@malipano.com / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
