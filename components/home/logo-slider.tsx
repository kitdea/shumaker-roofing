/**
 * LogoSlider — infinite CSS ticker, no JS required (best performance).
 * Items are triplicated so the loop is seamless at any viewport width.
 * Animation runs from 0 → -33.333...% (one third of total track width).
 * Pauses on hover via CSS animation-play-state.
 */

import Image from "next/image";

export interface CertificationBadge {
  id: string;
  name: string;
  logoUrl: string;
}

const FALLBACK_BADGES: CertificationBadge[] = [
  { id: "google-guaranteed", name: "Google Guaranteed Service Provider", logoUrl: "" },
  { id: "certainteed-select", name: "CertainTeed SELECT ShingleMaster", logoUrl: "" },
  { id: "tamko-pro", name: "TAMKO PRO Certified Contractor", logoUrl: "" },
  { id: "certainteed-5star", name: "CertainTeed 5-Star Contractor", logoUrl: "" },
  { id: "sdvosb", name: "SDVOSB Veteran Owned Small Business", logoUrl: "" },
  { id: "velux-certified", name: "VELUX Certified Installer", logoUrl: "" },
];

function BadgeCard({ badge }: { badge: CertificationBadge }) {
  return (
    <article
      aria-label={badge.name}
      className="flex-shrink-0 w-44 mx-4 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden select-none"
    >
      <div className="flex flex-col items-center justify-center px-4 py-6 h-28">
        {badge.logoUrl ? (
          <Image
            src={badge.logoUrl}
            alt={badge.name}
            width={140}
            height={60}
            className="object-contain max-h-16 w-auto"
          />
        ) : (
          <span className="text-[11px] text-slate-500 text-center font-medium leading-tight">
            {badge.name}
          </span>
        )}
      </div>
    </article>
  );
}

interface LogoSliderProps {
  badges?: CertificationBadge[];
}

/**
 * Pure server component — animation driven entirely by CSS.
 * Triplicate so the visible window never reaches the end.
 */
export function LogoSlider({ badges }: LogoSliderProps) {
  const items = badges && badges.length > 0 ? badges : FALLBACK_BADGES;
  const track = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-6"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
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
