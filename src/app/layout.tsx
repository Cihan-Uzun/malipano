import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "MaliPano — Muhasebe ofisin için tek panel",
  description:
    "SMMM ofisleri için çok kiracılı panel: firmalar, beyannameler, görevler, e-tebligat, ödeme bildirimleri ve daha fazlası.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
