import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTL(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const BEYANNAME_TIP_LABELS: Record<string, string> = {
  E_DEFTER: "e-Defter",
  GECICI_VERGI: "Geçici Vergi",
  MUHSGK: "Muhtasar + SGK",
  KDV: "KDV",
  DIGER: "Diğer",
};

export const BEYANNAME_DURUM_LABELS: Record<string, string> = {
  HAZIR: "Hazırlanıyor",
  ONAY_BEKLIYOR: "Onay Bekliyor",
  TAMAM: "Tamam",
  GECIKMIS: "Gecikmiş",
};

export const GOREV_DURUM_LABELS: Record<string, string> = {
  BEKLEYEN: "Bekleyen",
  TAMAM: "Tamam",
};

export const MEVZUAT_KAYNAK_LABELS: Record<string, string> = {
  RESMI_GAZETE: "Resmi Gazete",
  SICIL: "Sicil",
  GIB: "GİB",
  SGK: "SGK",
};
