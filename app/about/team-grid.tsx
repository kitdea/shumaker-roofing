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
};

function MemberCard({ member, onClick }: { member: TeamMember; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-background rounded-xl overflow-hidden shadow-md border border-border/50 group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left w-full"
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
              className="relative z-10 flex flex-row w-full max-w-5xl bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]"
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

              {/* Image panel — same 9:11 portrait ratio as thumbnail */}
              <div className="shrink-0 w-36 sm:w-56 md:w-72 lg:w-80 bg-muted/50 self-stretch">
                <div className="relative w-full aspect-[9/11] h-full">
                  <Image
                    src={selectedMember.img}
                    alt={selectedMember.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
                    priority
                  />
                </div>
              </div>

              {/* Content panel — takes remaining width, scrollable */}
              <div className="flex flex-col justify-center flex-1 min-w-0 p-6 sm:p-8 md:p-12 overflow-y-auto">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground mb-1 pr-8">{selectedMember.name}</h3>
                <p className="text-primary font-medium uppercase tracking-wider text-xs sm:text-sm mb-4">{selectedMember.role}</p>
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
