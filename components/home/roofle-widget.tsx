"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://app.roofle.com/roof-quote-pro-embedded-widget.js?id=edgE0YoULrACgxaIeovOR";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT"]);

export function RoofleWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove any leftover script from a previous mount
    document.querySelector(`script[src="${SCRIPT_SRC}"]`)?.remove();

    // Snapshot ALL current body children before the script is injected
    const before = new Set(Array.from(document.body.children));

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    before.add(script); // exclude the script tag itself

    // Move every new body child (not just the first) into our section container.
    // Roofle may inject more than one element (e.g. backdrop + widget root).
    function moveAllNewChildren() {
      const target = containerRef.current;
      if (!target) return;
      for (const el of Array.from(document.body.children)) {
        if (!before.has(el) && !SKIP_TAGS.has(el.tagName)) {
          target.appendChild(el);
          before.add(el); // mark as moved so we don't touch it again
        }
      }
    }

    // Poll after the script is fully loaded — the widget initialises asynchronously
    let pollId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    script.onload = () => {
      // Give the React widget bundle time to boot and render
      timeoutId = setTimeout(() => {
        moveAllNewChildren();

        // Continue polling in case Roofle injects lazily after initial paint
        pollId = setInterval(moveAllNewChildren, 300);

        // Stop polling after 15 s
        setTimeout(() => clearInterval(pollId), 15_000);
      }, 500);
    };

    return () => {
      clearInterval(pollId);
      clearTimeout(timeoutId);
      script.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-live="polite"
      className="w-full min-h-[480px] sm:min-h-[520px]"
    />
  );
}
