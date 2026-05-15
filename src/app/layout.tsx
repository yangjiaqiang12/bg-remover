import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BG Remover — Remove Image Backgrounds Free with AI",
  description:
    "Remove image backgrounds instantly with AI. No signup, no upload limits on watermark — get transparent PNGs in seconds. Free 3 uses per day.",
  openGraph: {
    title: "BG Remover — AI Background Removal Tool",
    description:
      "Remove image backgrounds instantly with AI. No signup needed. Free to use.",
    type: "website",
    siteName: "BG Remover",
  },
  twitter: {
    card: "summary_large_image",
    title: "BG Remover — AI Background Removal Tool",
    description:
      "Remove image backgrounds instantly with AI. No signup needed. Free to use.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bg-remover-beige-gamma.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "BG Remover",
              description:
                "Remove image backgrounds instantly with AI. Free 3 uses per day.",
              applicationCategory: "Multimedia",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
