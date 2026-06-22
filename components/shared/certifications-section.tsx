import { fetchCertificationBadges } from "@/lib/sanity";
import { LogoSlider } from "@/components/home/logo-slider";

export async function CertificationsSection() {
  const badges = await fetchCertificationBadges();
  return (
    <section
      className="py-14 bg-slate-900 overflow-hidden"
      aria-label="Trusted roofing certifications and partnerships"
    >
      <div className="text-center mb-10 px-4">
        <span className="text-primary font-bold tracking-wider uppercase text-sm block mb-2">
          Certifications &amp; Partnerships
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
          Trusted Roofing Contractor in Frederick, MD
        </h2>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
          Backed by the industry&apos;s most respected certifications and manufacturer partnerships.
        </p>
      </div>
      <LogoSlider badges={badges} />
    </section>
  );
}
