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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","m2654ikl3f");`}
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
