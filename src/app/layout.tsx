import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aegus.digital"),
  title: {
    default: "Aegus PATH — Memecoin research + multi-asset trading",
    template: "%s · Aegus PATH",
  },
  description:
    "Aegus PATH is a memecoin research platform and a multi-asset trading platform. Discover narratives the moment they reawaken. Trade Solana memecoins, BTC, tokenized gold, and xStocks equities. Every signal Institute-graded.",
  openGraph: {
    title: "Aegus PATH",
    description: "Memecoin research + multi-asset trading. Solana, BTC, gold, xStocks.",
    type: "website",
    url: "https://aegus.digital",
    siteName: "Aegus PATH",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegus PATH",
    description: "Memecoin research + multi-asset trading.",
    creator: "@Aegus_AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-canvas text-fg antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
