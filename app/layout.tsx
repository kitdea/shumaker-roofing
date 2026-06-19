import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { cn, SITE_URL } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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
        url: "https://images.ctfassets.net/1daipl7z93ig/ZKSfLysHgXPAYYPfbDqT9/1a87cf72f401cdd63349b9c1f7750187/shumaker-roofing-company.jpg",
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
    images: [
      "https://images.ctfassets.net/1daipl7z93ig/ZKSfLysHgXPAYYPfbDqT9/1a87cf72f401cdd63349b9c1f7750187/shumaker-roofing-company.jpg",
    ],
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
      </body>
    </html>
  );
}
