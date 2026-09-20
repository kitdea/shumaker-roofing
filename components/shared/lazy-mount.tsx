"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defers mounting `children` until the wrapper scrolls near the viewport.
 *
 * Used for heavy third-party embeds (GHL form/calendar iframes + their
 * form_embed.js script, which pulls in Maps Places API, ~600KB+ combined)
 * that otherwise load on every page visit regardless of whether the user
 * ever scrolls to them — directly inflating LCP/TBT on /contact and
 * /book-appointment. `rootMargin` pre-loads slightly before the element
 * is actually visible so there's no visible pop-in on a normal scroll.
 */
export function LazyMount({
  children,
  placeholderHeight,
  rootMargin = "400px",
}: {
  children: ReactNode;
  placeholderHeight?: number | string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (visible) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      style={placeholderHeight ? { minHeight: placeholderHeight } : undefined}
      aria-hidden="true"
    />
  );
}
