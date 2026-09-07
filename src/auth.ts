import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

declare module "next-auth" {
  interface User {
    officeId?: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      officeId: string;
      role: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    officeId?: string;
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          officeId: user.officeId,
          role: user.role,
        };
      },
    }),
  ],
});
