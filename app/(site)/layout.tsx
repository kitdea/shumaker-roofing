import Script from "next/script";
import { NavbarServer } from "@/components/shared/navbar-server";
import { Footer } from "@/components/shared/footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
      {/* Roofle floating quote button — site pages only, excluded from /studio */}
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
    </>
  );
}
