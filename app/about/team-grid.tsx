"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  img: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teamInfo: any;
  email?: string | null;
  socialMedia?: string | null;
  phoneNumber?: string | number | null;
  salesmanTag?: string | null;
  retired?: boolean;
};

function MemberCard({ member, onClick }: { member: TeamMember; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-background rounded-xl overflow-hidden shadow-md border border-border/50 group cursor-pointer text-left w-full"
      aria-label={`View ${member.name}'s profile`}
    >
      <div className="relative w-full aspect-[9/11] overflow-hidden bg-muted/50">
        <Image
          src={member.img}
          alt={member.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        {member.retired && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
            Retired
          </span>
        )}
      </div>
      <div className="p-6 text-center">
        <h4 className="text-xl font-heading font-bold text-foreground">{member.name}</h4>
        <p className="text-primary font-medium mt-1">{member.role}</p>
      </div>
    </button>
  );
}

export function TeamGrid({ team, firstRowCount = 2 }: { team: TeamMember[]; firstRowCount?: number }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedMember ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedMember]);

  const firstRow = team.slice(0, firstRowCount);
  const rest = team.slice(firstRowCount);

  return (
    <>
      {/* First row: centered, 2 columns max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto w-full">
        {firstRow.map((member) => (
          <MemberCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
        ))}
      </div>

      {/* Remaining rows: 3 columns */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {rest.map((member) => (
            <MemberCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
          ))}
        </div>
      )}


      <AnimatePresence>
        {selectedMember && (
          <motion.div
            key="team-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10"
            aria-modal="true"
            role="dialog"
            aria-label={`${selectedMember.name} profile`}
          >
            {/* Backdrop */}
            <div
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal — always horizontal, full width up to 5xl */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative z-10 flex flex-col sm:flex-row w-full max-w-7xl bg-background border border-border/50 rounded-2xl shadow-2xl overflow-y-auto sm:overflow-hidden max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors z-20 group"
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Image panel — full width on mobile, fixed sidebar on sm+ */}
              <div className="shrink-0 w-full h-56 sm:w-56 sm:h-auto md:w-72 lg:w-80 bg-muted/50">
                <div className="relative w-full h-full aspect-[9/11]">
                  <Image
                    src={selectedMember.img}
                    alt={selectedMember.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
                    priority
                  />
                </div>
              </div>

              {/* Content panel — takes remaining width, scrollable */}
              <div className="flex flex-col justify-center flex-1 min-w-0 p-6 sm:p-8 md:p-12 sm:overflow-y-auto">
                <div className="flex items-center gap-3 flex-wrap pr-8 mb-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">{selectedMember.name}</h3>
                  {selectedMember.retired && (
                    <span className="bg-amber-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Retired
                    </span>
                  )}
                </div>
                <p className="text-primary font-medium uppercase tracking-wider text-xs sm:text-sm mb-2">{selectedMember.role}</p>
                {selectedMember.salesmanTag && (
                  <p className="text-foreground/50 text-xs sm:text-sm italic mb-2">{selectedMember.salesmanTag}</p>
                )}
                {(selectedMember.email || selectedMember.socialMedia || selectedMember.phoneNumber) && (
                  <div className="flex flex-col gap-1 mb-4">
                    {selectedMember.phoneNumber && (
                      <a
                        href={`tel:${String(selectedMember.phoneNumber).replace(/\D/g, "")}`}
                        className="text-foreground/60 hover:text-primary text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                        aria-label={`Call ${selectedMember.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {String(selectedMember.phoneNumber)}
                      </a>
                    )}
                    {selectedMember.email && (
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="text-foreground/60 hover:text-primary text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                        aria-label={`Email ${selectedMember.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {selectedMember.email}
                      </a>
                    )}
                    {selectedMember.socialMedia && (
                      <a
                        href={selectedMember.socialMedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/60 hover:text-primary text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                        aria-label={`${selectedMember.name}'s social media profile`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {selectedMember.socialMedia}
                      </a>
                    )}
                  </div>
                )}
                <div className="w-12 h-1 bg-primary mb-4 rounded-full" />
                <div className="text-foreground/70 leading-relaxed text-sm sm:text-base contentful-rich-text">
                  {selectedMember.teamInfo && typeof selectedMember.teamInfo === "object"
                    ? documentToReactComponents(selectedMember.teamInfo)
                    : selectedMember.teamInfo}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
