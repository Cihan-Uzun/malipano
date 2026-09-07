import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const protectedPrefixes = [
        "/panel",
        "/firmalar",
        "/beyannameler",
        "/gorevler",
        "/e-tebligat",
        "/odeme-bildirimleri",
        "/cari",
        "/yevmiye",
        "/mevzuat",
        "/ayarlar",
      ];
      const isProtected = protectedPrefixes.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
      if (isProtected) return !!auth;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.officeId = (user as { officeId?: string }).officeId;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { officeId?: string }).officeId = token.officeId as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
