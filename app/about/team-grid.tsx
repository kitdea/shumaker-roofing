"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  img: string;
};

export function TeamGrid({ team }: { team: TeamMember[] }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMember]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
        {team.map((member) => (
          <div 
            key={member.id} 
            className="bg-background rounded-xl overflow-hidden shadow-md border border-border/50 group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setSelectedMember(member)}
          >
            <div className="relative h-72 w-full overflow-hidden bg-muted/50">
              <Image 
                src={member.img} 
                alt={member.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="p-6 text-center">
              <h4 className="text-xl font-heading font-bold text-foreground">{member.name}</h4>
              <p className="text-primary font-medium mt-1">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            key="team-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" 
            aria-modal="true" 
            role="dialog"
          >
            {/* Backdrop */}
            <div 
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative w-full max-w-lg bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors z-20 group"
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="relative h-80 sm:h-96 w-full bg-muted/50">
                <Image 
                  src={selectedMember.img} 
                  alt={selectedMember.name} 
                  fill 
                  className="object-cover" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              </div>
              
              <div className="p-8 text-center bg-background relative -mt-12 z-10">
                <h3 className="text-3xl font-heading font-bold text-foreground mb-2">{selectedMember.name}</h3>
                <p className="text-lg text-primary font-medium mb-6 uppercase tracking-wider text-sm">{selectedMember.role}</p>
                <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
                <p className="text-foreground/70 leading-relaxed max-w-md mx-auto">
                  A dedicated professional at Shumaker Roofing, committed to providing top-quality service, ensuring safety, and upholding our core values of integrity and excellence in every project.
                </p>
                
                <div className="mt-8 pt-6 border-t border-border/50">
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
