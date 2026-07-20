import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn, SITE_URL, FALLBACK_BLOG_IMAGE } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Roofing Contractor in Frederick MD | Shumaker Roofing",
    template: "%s | Shumaker Roofing",
  },
  description:
    "Shumaker Roofing provides top-notch residential and commercial roofing services, including repairs, replacements, and inspections. Licensed and insured professionals.",
  keywords: [
    "roofing",
    "roof repair",
    "roof replacement",
    "residential roofing",
    "commercial roofing",
    "Shumaker Roofing",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Roofing Contractor in Frederick MD | Shumaker Roofing",
    description:
      "Shumaker Roofing provides top-notch residential and commercial roofing services, including repairs, replacements, and inspections. Licensed and insured professionals.",
    siteName: "Shumaker Roofing",
    images: [
      {
        url: FALLBACK_BLOG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Shumaker Roofing Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roofing Contractor in Frederick MD | Shumaker Roofing",
    description:
      "Shumaker Roofing provides top-notch residential and commercial roofing services.",
    images: [FALLBACK_BLOG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "oTVHtZ3SVCtxxrJ1d1V_iWXJR3K_KkvT3GVeFh_Sz8o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", inter.variable, montserrat.variable)}>
        {children}
        <Script
          src="//cdn.callrail.com/companies/225471548/622609537a81b32b2734/12/swap.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
