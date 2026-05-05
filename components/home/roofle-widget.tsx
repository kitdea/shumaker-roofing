"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://app.roofle.com/roof-quote-pro-embedded-widget.js?id=edgE0YoULrACgxaIeovOR";

export function RoofleWidget() {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      aria-live="polite"
      className="w-full min-h-[480px] sm:min-h-[520px]"
    />
  );
}
