"use client";

import Script from "next/script";

export function VeluxWidget() {
  return (
    <>
      <div
        id="velux-brochure"
        data-cta-link="https://shumakerroofing.com/appointment-calendar-book-now/"
        data-cta-text="Request a Quote"
        data-installer-domain="https://shumakerroofing.com/skylight-installation-in-frederick-md/"
      />
      <Script
        src="https://veluxsolutions.com/installer-embed/velux-roofer.js"
        strategy="afterInteractive"
      />
    </>
  );
}
