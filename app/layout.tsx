import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shumakerroofing.com"),
  title: {
    default: "Shumaker Roofing | Quality Residential & Commercial Roofing",
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
    url: "https://www.shumakerroofing.com",
    title: "Shumaker Roofing | Quality Residential & Commercial Roofing",
    description:
      "Shumaker Roofing provides top-notch residential and commercial roofing services, including repairs, replacements, and inspections. Licensed and insured professionals.",
    siteName: "Shumaker Roofing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2070&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Shumaker Roofing Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shumaker Roofing | Quality Residential & Commercial Roofing",
    description:
      "Shumaker Roofing provides top-notch residential and commercial roofing services.",
    images: [
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  alternates: {
    canonical: "/",
  },
};

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", inter.variable, montserrat.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
