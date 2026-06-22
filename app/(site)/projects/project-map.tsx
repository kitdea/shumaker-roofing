"use client";

import { useEffect, useRef } from "react";

const PMI_MAP_URL =
  "https://projectmapit.com/shumaker-roofing/map?map=63d9226f435a4637d2f58417";
const PMI_EMBED_SRC = "https://projectmapit.com/static/js/embed.js";

export function ProjectMap() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || document.querySelector(`script[src="${PMI_EMBED_SRC}"]`)) {
      return;
    }
    loaded.current = true;

    (window as Window & { __PMI_WIDTH__?: string; __PMI_HEIGHT__?: string; __PMISRC__?: string }).__PMI_WIDTH__ = "100%";
    (window as Window & { __PMI_WIDTH__?: string; __PMI_HEIGHT__?: string; __PMISRC__?: string }).__PMI_HEIGHT__ = "665px";
    (window as Window & { __PMI_WIDTH__?: string; __PMI_HEIGHT__?: string; __PMISRC__?: string }).__PMISRC__ = PMI_MAP_URL;

    const script = document.createElement("script");
    script.async = true;
    script.src = PMI_EMBED_SRC;
    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="__pmiembed"
      role="region"
      aria-label="Shumaker Roofing completed projects map"
      style={{ minHeight: "665px" }}
      className="w-full rounded-xl overflow-hidden border border-border shadow-lg"
    />
  );
}
