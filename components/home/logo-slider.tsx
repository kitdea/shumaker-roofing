/**
 * LogoSlider — infinite CSS ticker, no JS required (best performance).
 * Items are triplicated so the loop is seamless at any viewport width.
 * Animation runs from 0 → -33.333...% (one third of total track width).
 * Pauses on hover via CSS animation-play-state.
 */

import { Star, ShieldCheck, Home, Flag, Sun, Award } from "lucide-react";

interface Badge {
  id: string;
  /** Short name shown under the icon — used as accessible aria-label */
  label: string;
  /** Longer description for screen readers */
  description: string;
  /** Lucide icon component */
  Icon: React.ElementType;
  /** Top accent bar color (Tailwind bg-* class) */
  accentColor: string;
  /** Icon bg color */
  iconBg: string;
  /** Icon color */
  iconColor: string;
  /** First line of badge text */
  line1: string;
  /** Second line of badge text (bolder) */
  line2: string;
  /** Optional third line */
  line3?: string;
}

const badges: Badge[] = [
  {
    id: "google-guaranteed",
    label: "Google Guaranteed",
    description: "Google Guaranteed Service Provider — verified and trusted by Google",
    Icon: ShieldCheck,
    accentColor: "bg-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    line1: "Google",
    line2: "GUARANTEED",
    line3: "Service Provider",
  },
  {
    id: "certainteed-shinglemaster",
    label: "CertainTeed SELECT ShingleMaster",
    description: "CertainTeed SELECT ShingleMaster certified roofing contractor",
    Icon: Home,
    accentColor: "bg-green-600",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    line1: "CertainTeed",
    line2: "SELECT",
    line3: "ShingleMaster™",
  },
  {
    id: "tamko-pro",
    label: "TAMKO Mastercraft PRO Certified Contractor",
    description: "TAMKO Mastercraft PRO Certified Contractor — elite installation standard",
    Icon: Award,
    accentColor: "bg-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-700",
    line1: "TAMKO",
    line2: "PRO CERTIFIED",
    line3: "Contractor MC",
  },
  {
    id: "certainteed-5star",
    label: "CertainTeed 5-Star Contractor",
    description: "CertainTeed 5-Star Contractor — highest level of installation excellence",
    Icon: Star,
    accentColor: "bg-blue-700",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    line1: "CertainTeed",
    line2: "5★ STAR",
    line3: "Contractor",
  },
  {
    id: "sdvosb",
    label: "SDVOSB — Service Disabled Veteran Owned Small Business",
    description: "Service Disabled Veteran Owned Small Business — SBA certified cVe",
    Icon: Flag,
    accentColor: "bg-navy-800",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    line1: "SDVOSB",
    line2: "Veteran Owned",
    line3: "Small Business · cVe",
  },
  {
    id: "velux-certified",
    label: "VELUX Certified Installer",
    description: "VELUX Certified Installer — trained specialist for skylights and roof windows",
    Icon: Sun,
    accentColor: "bg-red-500",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    line1: "VELUX",
    line2: "CERTIFIED",
    line3: "Installer",
  },
];

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <article
      aria-label={badge.description}
      className="flex-shrink-0 w-44 mx-4 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden select-none"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${badge.accentColor}`} aria-hidden="true" />
      <div className="flex flex-col items-center text-center px-4 py-5 gap-3">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.iconBg}`}>
          <badge.Icon className={`h-6 w-6 ${badge.iconColor}`} aria-hidden="true" />
        </div>
        {/* Text */}
        <div className="space-y-0.5">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium leading-tight">
            {badge.line1}
          </p>
          <p className="text-[13px] text-slate-900 font-extrabold leading-tight">
            {badge.line2}
          </p>
          {badge.line3 && (
            <p className="text-[10px] text-slate-500 leading-tight">{badge.line3}</p>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Pure server component — animation driven entirely by CSS.
 * Triplicate so the visible window never reaches the end.
 * One copy scrolls out → seamlessly wraps → next copy scrolls in.
 */
export function LogoSlider() {
  // Triple the badges: animate translateX(0 → -33.333%) for a seamless loop
  const track = [...badges, ...badges, ...badges];

  return (
    /* Outer mask fades edges */
    <div
      className="relative overflow-hidden py-6"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* Ticker track — inline style ensures animation-duration and infinite are applied atomically */}
      <div
        className="flex w-max"
        style={{
          animation: "logo-ticker 28s linear infinite",
          willChange: "transform",
        }}
        aria-label="Trusted roofing certification logos"
        role="list"
      >
        {track.map((badge, idx) => (
          <div key={`${badge.id}-${idx}`} role="listitem">
            <BadgeCard badge={badge} />
          </div>
        ))}
      </div>
    </div>
  );
}
