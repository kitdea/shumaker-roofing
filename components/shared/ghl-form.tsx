"use client";

import Script from "next/script";
import { LazyMount } from "@/components/shared/lazy-mount";

function GhlFormEmbed() {
  return (
    <>
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/M7q2LPbQeLEBDuohoqMH"
        style={{ width: "100%", border: "none", borderRadius: "3px" }}
        id="inline-M7q2LPbQeLEBDuohoqMH"
        data-layout='{"id":"INLINE"}'
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Free Consultation"
        data-height="1315"
        data-layout-iframe-id="inline-M7q2LPbQeLEBDuohoqMH"
        data-form-id="M7q2LPbQeLEBDuohoqMH"
        title="Free Consultation - Shumaker Roofing"
        loading="lazy"
        aria-label="Free Consultation Form"
      />
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}

export function GhlForm() {
  // Deferred until scrolled near — this pulls in ~600KB+ of third-party JS
  // (form_embed.js + the Maps Places API it triggers) that was previously
  // loading on every /contact visit regardless of scroll position,
  // directly inflating LCP/TBT (measured 10.2s LCP / 1265ms TBT).
  return (
    <LazyMount placeholderHeight={1315}>
      <GhlFormEmbed />
    </LazyMount>
  );
}
