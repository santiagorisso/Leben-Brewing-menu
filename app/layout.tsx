import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/components/back-to-top";
import { InfiniteTextSlider } from "@/components/infinite-text-slider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bar Menu",
  description: "Our curated selection of beers, wines, cocktails, and food",
  generator: "v0.app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // iOS safe area support
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
        <div className="pt-[2.5rem] md:pt-12">{children}</div>
        <InfiniteTextSlider position="bottom" />
        <div className="pb-[2.5rem] md:pb-12" />
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
