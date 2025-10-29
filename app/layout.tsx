import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/components/back-to-top";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bar Menu",
  description: "Our curated selection of beers, wines, cocktails, and food",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
