"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Minimum horizontal distance (px) to register a swipe instead of a tap. */
const DRAG_THRESHOLD = 50;

const slides = [
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
    alt: "Professional roof installation with new shingles on a residential home",
    caption: "Residential Roof Installation",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop",
    alt: "Expert roofers performing shingle replacement on a sloped roof",
    caption: "Shingle Replacement & Repair",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    alt: "Beautifully completed modern home exterior with new roofing",
    caption: "Modern Home Exterior Roofing",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
    alt: "Construction crew working on a large commercial roofing project",
    caption: "Commercial Roofing Projects",
  },
  {
    src: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2070&auto=format&fit=crop",
    alt: "Shumaker Roofing professionals inspecting and repairing a roof",
    caption: "Expert Roof Inspections",
  },
  {
    src: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?q=80&w=2070&auto=format&fit=crop",
    alt: "Skilled roofing team completing a quality roof replacement project",
    caption: "Full Roof Replacements",
  },
];

export function ProjectSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // All drag state in a single ref — no re-renders during the gesture
  const drag = useRef({
    startX: 0,
    active: false,
    moved: false,
    /** True only for the one synthetic click event that fires after a drag release. */
    blockNextClick: false,
  });

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, isPaused]);

  // ── Drag handlers ────────────────────────────────────────────────────────────
  // Using Pointer Events API: one API for mouse, touch, and stylus.

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only track primary input (left mouse button or first touch point)
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current.startX = e.clientX;
    drag.current.active = true;
    drag.current.moved = false;
    drag.current.blockNextClick = false;
    // Capture so pointermove/up fire even when pointer leaves the element
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPaused(true);
    containerRef.current?.classList.add("!cursor-grabbing");
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    // Mark as a genuine drag only after the pointer has moved meaningfully
    if (Math.abs(e.clientX - drag.current.startX) > 5) {
      drag.current.moved = true;
    }
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag.current.active) return;

      const delta = e.clientX - drag.current.startX;
      const wasMoved = drag.current.moved;

      // Reset drag state before the subsequent click event fires
      drag.current.active = false;
      drag.current.moved = false;
      containerRef.current?.classList.remove("!cursor-grabbing");
      setIsPaused(false);

      if (wasMoved && Math.abs(delta) >= DRAG_THRESHOLD) {
        // Block only the single click that the browser fires right after
        // this pointer-up — so buttons/dots don't double-trigger.
        drag.current.blockNextClick = true;
        delta < 0 ? goNext() : goPrev();
      }
    },
    [goNext, goPrev],
  );

  // Capture-phase click guard: fires before any child onClick.
  // Only active for the one click event that immediately follows a drag.
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.blockNextClick) {
      e.stopPropagation();
      drag.current.blockNextClick = false;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden group cursor-grab select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        if (drag.current.active) {
          drag.current.active = false;
          containerRef.current?.classList.remove("!cursor-grabbing");
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
      aria-roledescription="carousel"
      aria-label="Shumaker Roofing project gallery"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${slides.length}: ${slide.caption}`}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            // draggable=false + pointer-events-none prevents the browser's
            // native image-drag ghost from appearing during a swipe
            draggable={false}
            className="object-cover pointer-events-none"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Gradient overlay for caption readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          {/* Caption */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-10">
            <span className="inline-block bg-primary/90 text-white text-sm md:text-base font-semibold px-5 py-2 rounded-full tracking-wide shadow-lg backdrop-blur-sm">
              {slide.caption}
            </span>
          </div>
        </div>
      ))}

      {/* Prev Button — onClick works normally; only suppressed right after a drag */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-primary transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next Button — onClick works normally; only suppressed right after a drag */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-primary transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot Indicators — onClick works normally; only suppressed right after a drag */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}: ${slide.caption}`}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "w-6 bg-primary"
                : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
