"use client";

import Script from "next/script";

export function GhlForm() {
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
