import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if ((pathname === "/giris" || pathname === "/kayit") && req.auth) {
    return NextResponse.redirect(new URL("/panel", req.nextUrl.origin));
  }

  const isProtected =
    pathname.startsWith("/panel") ||
    pathname.startsWith("/firmalar") ||
    pathname.startsWith("/beyannameler") ||
    pathname.startsWith("/gorevler") ||
    pathname.startsWith("/e-tebligat") ||
    pathname.startsWith("/odeme-bildirimleri") ||
    pathname.startsWith("/cari") ||
    pathname.startsWith("/yevmiye") ||
    pathname.startsWith("/mevzuat") ||
    pathname.startsWith("/ayarlar");

  if (isProtected && !req.auth) {
    const url = new URL("/giris", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/panel/:path*",
    "/firmalar/:path*",
    "/beyannameler/:path*",
    "/gorevler/:path*",
    "/e-tebligat/:path*",
    "/odeme-bildirimleri/:path*",
    "/cari/:path*",
    "/yevmiye/:path*",
    "/mevzuat/:path*",
    "/ayarlar/:path*",
    "/giris",
    "/kayit",
  ],
};
