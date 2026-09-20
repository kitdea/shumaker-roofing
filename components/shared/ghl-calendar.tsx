"use client";

import Script from "next/script";
import { LazyMount } from "@/components/shared/lazy-mount";

function GhlCalendarEmbed() {
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

export function GhlCalendar() {
  // Same deferred-mount treatment as GhlForm (see ghl-form.tsx) — the
  // booking iframe + form_embed.js were loading unconditionally on every
  // /book-appointment visit.
  return (
    <LazyMount placeholderHeight={800}>
      <GhlCalendarEmbed />
    </LazyMount>
  );
}
