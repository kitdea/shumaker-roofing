"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://app.roofle.com/roof-quote-pro-embedded-widget.js?id=edgE0YoULrACgxaIeovOR";

export function RoofleWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const knownChildren = new Set(Array.from(document.body.children));

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    knownChildren.add(script);

    function adoptNewChildren() {
      const target = containerRef.current;
      if (!target) return;
      for (const el of Array.from(document.body.children)) {
        if (!knownChildren.has(el) && el.tagName !== "SCRIPT") {
          target.appendChild(el);
          knownChildren.add(el);
        }
      }
    }

    let pollId: ReturnType<typeof setInterval>;
    script.onload = () => {
      setTimeout(() => {
        adoptNewChildren();
        pollId = setInterval(adoptNewChildren, 300);
        setTimeout(() => clearInterval(pollId), 10_000);
      }, 500);
    };

    return () => clearInterval(pollId);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-live="polite"
      className="w-full min-h-[480px] sm:min-h-[520px]"
    />
  );
}
