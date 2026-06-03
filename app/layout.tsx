import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { db } from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export async function generateMetadata(): Promise<Metadata> {
  let favicon =
    "https://storage.googleapis.com/timetraq-public/other/img/Logo%20TK%20No%20BG%20ukuran%20kecil%20(2).png";
  try {
    const settings = await db.getSettings();
    if (settings?.site_config?.favicon) {
      favicon = settings.site_config.favicon;
    }
  } catch (e) {}
  return {
    title: "TemanKecil - Showcase Aplikasi & Interaktif AI",
    description:
      "Platform showcase aplikasi TemanKecil dengan sistem credit, simulasi Google Sign-In, dan pengisian credit yang canggih.",
    icons: {
      icon: favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body
        className="min-h-screen bg-slate-50 antialiased selection:bg-blue-100 selection:text-blue-950"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
