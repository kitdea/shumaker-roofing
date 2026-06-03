"use client";

import Script from "next/script";

export function GhlCalendar() {
  return (
    <>
      <iframe
        src="https://api.leadconnectorhq.com/widget/booking/6ESg9e0AUGMHG6F3o64N"
        style={{ width: "100%", height: "800px", border: "none", overflow: "scroll" }}
        id="6ESg9e0AUGMHG6F3o64N_1737489225713"
        title="Book an Appointment - Shumaker Roofing"
        loading="lazy"
        aria-label="Appointment Booking Calendar"
      />
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
