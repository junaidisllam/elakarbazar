import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import NextTopLoader from "nextjs-toploader";
import pool from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "এলাকার বাজার - সেরা অফার ও কুপন",
  description: "আপনার জন্য সেরা সব ডিসকাউন্ট অফার, ক্যাটাগরি এবং ব্র্যান্ডের কুপন কোড।",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headerCode = "";
  let footerCode = "";

  try {
    const [rows] = await pool.query("SELECT * FROM settings WHERE `key` IN ('header_code', 'footer_code')");
    if (Array.isArray(rows)) {
      (rows as any[]).forEach((row) => {
        if (row.key === "header_code") headerCode = row.value || "";
        if (row.key === "footer_code") footerCode = row.value || "";
      });
    }
  } catch (error) {
    console.error("Layout settings fetch error:", error);
  }

  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <head dangerouslySetInnerHTML={headerCode ? { __html: headerCode } : undefined} />
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <NextTopLoader
          color="#D90048"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #D90048, 0 0 5px #D90048"
        />
        <AnalyticsTracker />
        <Navbar />
        {children}
        <Footer />
        {footerCode && <div dangerouslySetInnerHTML={{ __html: footerCode }} />}
      </body>
    </html>
  );
}
