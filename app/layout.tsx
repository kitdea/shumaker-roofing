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
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "google8d7a9d080d00094f",
  },
};

import Script from "next/script";
import { NavbarServer } from "@/components/shared/navbar-server";
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','631999470863395');fbq('track','PageView');`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4NR3D3JVVL"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4NR3D3JVVL');`}
        </Script>
        {/* Roofle floating quote button — loads on all pages */}
        <Script
          src="https://app.roofle.com/roof-quote-pro-widget.js?id=edgE0YoULrACgxaIeovOR"
          strategy="lazyOnload"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarServer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
