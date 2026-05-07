"use client";

import Script from "next/script";

export function RoofleWidget() {
  return (
    <>
      <Script
        src="https://app.roofle.com/roof-quote-pro-embedded-widget.js?id=edgE0YoULrACgxaIeovOR"
        strategy="afterInteractive"
      />
      <div
        id="roofle-embedded-widget"
        aria-label="Instant roof quote estimator"
        aria-live="polite"
        className="w-full min-h-[480px] sm:min-h-[520px]"
      />
    </>
  );
}
