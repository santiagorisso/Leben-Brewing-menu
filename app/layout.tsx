import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/components/back-to-top";
import { InfiniteTextSlider } from "@/components/infinite-text-slider";
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
        <InfiniteTextSlider position="top" />
        <div className="pt-10 md:pt-12">{children}</div>
        <InfiniteTextSlider position="bottom" />
        <div className="pb-10 md:pb-12" />
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
