-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SAHIP',
    "officeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Firma" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "unvan" TEXT NOT NULL,
    "vkn" TEXT NOT NULL,
    "tip" TEXT NOT NULL DEFAULT 'KURUM',
    "telefon" TEXT,
    "email" TEXT,
    "notlar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Firma_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Beyanname" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "firmaId" TEXT,
    "tip" TEXT NOT NULL,
    "donem" TEXT NOT NULL,
    "sonTarih" DATETIME NOT NULL,
    "durum" TEXT NOT NULL DEFAULT 'HAZIR',
    "tamamlanan" INTEGER NOT NULL DEFAULT 0,
    "toplam" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Beyanname_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Beyanname_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gorev" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "firmaId" TEXT,
    "baslik" TEXT NOT NULL,
    "sonTarih" DATETIME,
    "durum" TEXT NOT NULL DEFAULT 'BEKLEYEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Gorev_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Gorev_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OfisMesaj" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "yazarId" TEXT,
    "icerik" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OfisMesaj_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OfisMesaj_yazarId_fkey" FOREIGN KEY ("yazarId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tebligat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "firmaId" TEXT,
    "konu" TEXT NOT NULL,
    "tarih" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "okundu" BOOLEAN NOT NULL DEFAULT false,
    "detay" TEXT,
    CONSTRAINT "Tebligat_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tebligat_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OdemeBildirimi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "firmaId" TEXT NOT NULL,
    "donem" TEXT NOT NULL,
    "not" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OdemeBildirimi_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OdemeBildirimi_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OdemeKalemi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bildirimId" TEXT NOT NULL,
    "tur" TEXT NOT NULL,
    "tutar" REAL NOT NULL,
    "sonTarih" DATETIME,
    "not" TEXT,
    CONSTRAINT "OdemeKalemi_bildirimId_fkey" FOREIGN KEY ("bildirimId") REFERENCES "OdemeBildirimi" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CariHareket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "firmaId" TEXT NOT NULL,
    "tarih" DATETIME NOT NULL,
    "aciklama" TEXT NOT NULL,
    "borc" REAL NOT NULL DEFAULT 0,
    "alacak" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "CariHareket_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CariHareket_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Yevmiye" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT NOT NULL,
    "tarih" DATETIME NOT NULL,
    "evrakNo" TEXT,
    "hesap" TEXT NOT NULL,
    "borc" REAL NOT NULL DEFAULT 0,
    "alacak" REAL NOT NULL DEFAULT 0,
    "aciklama" TEXT,
    CONSTRAINT "Yevmiye_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mevzuat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeId" TEXT,
    "kaynak" TEXT NOT NULL,
    "baslik" TEXT NOT NULL,
    "ozet" TEXT NOT NULL,
    "tarih" DATETIME NOT NULL,
    "onem" TEXT NOT NULL DEFAULT 'NORMAL',
    "yeni" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Mevzuat_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_slug_key" ON "Office"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Firma_officeId_idx" ON "Firma"("officeId");

-- CreateIndex
CREATE INDEX "Beyanname_officeId_idx" ON "Beyanname"("officeId");

-- CreateIndex
CREATE INDEX "Gorev_officeId_idx" ON "Gorev"("officeId");

-- CreateIndex
CREATE INDEX "OfisMesaj_officeId_idx" ON "OfisMesaj"("officeId");

-- CreateIndex
CREATE INDEX "Tebligat_officeId_idx" ON "Tebligat"("officeId");

-- CreateIndex
CREATE INDEX "OdemeBildirimi_officeId_idx" ON "OdemeBildirimi"("officeId");

-- CreateIndex
CREATE INDEX "CariHareket_officeId_idx" ON "CariHareket"("officeId");

-- CreateIndex
CREATE INDEX "CariHareket_firmaId_idx" ON "CariHareket"("firmaId");

-- CreateIndex
CREATE INDEX "Yevmiye_officeId_idx" ON "Yevmiye"("officeId");

-- CreateIndex
CREATE INDEX "Mevzuat_officeId_idx" ON "Mevzuat"("officeId");
