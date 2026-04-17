import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { fetchPageSeo } from "@/lib/seo";
import { FileText, AlertTriangle, Scale, RefreshCw, Ban, Gavel, Mail } from "lucide-react";

export async function generateMetadata() {
  return fetchPageSeo({
    path: "/terms-and-conditions",
    fallbackTitle: "Terms & Conditions | Shumaker Roofing",
    fallbackDesc:
      "Review Shumaker Roofing's Terms and Conditions governing the use of our website and services. Understanding these terms protects both you and us.",
  });
}

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "use-of-site", label: "Use of Site & Services" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "prohibited-activities", label: "Prohibited Activities" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact Us" },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop"
            alt="Terms and Conditions"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our website or
            engaging with our roofing services.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
            {/* Sidebar Table of Contents */}
            <aside className="lg:w-64 xl:w-72 shrink-0">
              <div className="lg:sticky lg:top-8">
                <div className="bg-muted/40 border border-border/50 rounded-2xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    On This Page
                  </p>
                  <nav aria-label="Terms and Conditions sections">
                    <ul className="flex flex-col gap-2">
                      {sections.map((s) => (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            className="text-sm text-foreground/70 hover:text-primary transition-colors block py-1 border-l-2 border-transparent hover:border-primary pl-3"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Last updated
                    </p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      April 17, 2026
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0" aria-label="Terms and Conditions content">
              {/* Intro */}
              <div className="mb-10">
                <p className="text-foreground/70 text-lg leading-relaxed">
                  These Terms and Conditions (&ldquo;Terms&rdquo;) govern your
                  access to and use of the Shumaker Roofing website and
                  services. By accessing or using our site, you agree to be
                  bound by these Terms. If you do not agree to all of these
                  Terms, do not use our site or services.
                </p>
              </div>

              {/* Section 1 */}
              <TermsSection
                id="acceptance"
                icon={<FileText className="h-5 w-5" />}
                title="Acceptance of Terms"
              >
                <p>
                  By accessing or using our website, you confirm that you are
                  at least 18 years of age, have read and understood these
                  Terms, and agree to be legally bound by them. If you are
                  using our site on behalf of an organization, you represent
                  and warrant that you have the authority to bind that
                  organization to these Terms.
                </p>
              </TermsSection>

              {/* Section 2 */}
              <TermsSection
                id="use-of-site"
                icon={<Scale className="h-5 w-5" />}
                title="Use of Site & Services"
              >
                <p>
                  You agree to use our website and services only for lawful
                  purposes and in a manner consistent with all applicable local,
                  state, national, and international laws and regulations.
                  Specifically, you agree to:
                </p>
                <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-foreground/70">
                  {[
                    "Provide accurate and current information when submitting contact forms or quote requests.",
                    "Not attempt to gain unauthorized access to any part of the site or its related systems.",
                    "Not use the site to transmit any unsolicited or unauthorized advertising or promotional material.",
                    "Not interfere with or disrupt the integrity or performance of the website.",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </TermsSection>

              {/* Section 3 */}
              <TermsSection
                id="intellectual-property"
                icon={<FileText className="h-5 w-5" />}
                title="Intellectual Property"
              >
                <p>
                  All content on this website — including but not limited to
                  text, graphics, logos, images, and software — is the property
                  of Shumaker Roofing and is protected by applicable copyright,
                  trademark, and other intellectual property laws.
                </p>
                <p className="mt-4">
                  You may not reproduce, distribute, modify, create derivative
                  works of, publicly display, or in any way exploit any of the
                  content on this site without our prior written consent, except
                  for your own personal, non-commercial use.
                </p>
              </TermsSection>

              {/* Section 4 */}
              <TermsSection
                id="disclaimers"
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Disclaimers"
              >
                <p>
                  The information on this website is provided on an
                  &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
                  without any warranties of any kind, either express or implied.
                  Shumaker Roofing makes no representations or warranties
                  regarding the accuracy, completeness, or suitability of the
                  information and materials found on this site.
                </p>
                <p className="mt-4">
                  Estimates and timelines provided through our website are
                  preliminary in nature. Final pricing and project timelines are
                  confirmed only through a written contract with our company.
                </p>
              </TermsSection>

              {/* Section 5 */}
              <TermsSection
                id="limitation-of-liability"
                icon={<Scale className="h-5 w-5" />}
                title="Limitation of Liability"
              >
                <p>
                  To the fullest extent permitted by law, Shumaker Roofing
                  shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages — including but not limited
                  to loss of profits, data, goodwill, or other intangible losses
                  — resulting from:
                </p>
                <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-foreground/70">
                  {[
                    "Your access to or use of (or inability to access or use) our website.",
                    "Any conduct or content of any third party on the site.",
                    "Unauthorized access, use, or alteration of your transmissions or content.",
                    "Any errors or omissions in any content on the site.",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </TermsSection>

              {/* Section 6 */}
              <TermsSection
                id="prohibited-activities"
                icon={<Ban className="h-5 w-5" />}
                title="Prohibited Activities"
              >
                <p>
                  You may not use the site for any purpose that is prohibited
                  by these Terms. The following activities are strictly
                  prohibited:
                </p>
                <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-foreground/70">
                  {[
                    "Engaging in any harassing, abusive, threatening, or discriminatory conduct.",
                    "Attempting to decipher, decompile, disassemble, or reverse-engineer any of the software comprising the site.",
                    "Uploading or transmitting viruses or any other malicious code.",
                    "Collecting or harvesting any personally identifiable information from the site.",
                    "Using the site to send unsolicited communications (spam).",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </TermsSection>

              {/* Section 7 */}
              <TermsSection
                id="governing-law"
                icon={<Gavel className="h-5 w-5" />}
                title="Governing Law"
              >
                <p>
                  These Terms shall be governed by and construed in accordance
                  with the laws of the State of [Your State], without regard to
                  its conflict of law provisions. Any dispute arising from or
                  relating to these Terms or your use of the site shall be
                  subject to the exclusive jurisdiction of the state and federal
                  courts located in [Your County], [Your State].
                </p>
              </TermsSection>

              {/* Section 8 */}
              <TermsSection
                id="changes"
                icon={<RefreshCw className="h-5 w-5" />}
                title="Changes to Terms"
              >
                <p>
                  We reserve the right to modify these Terms at any time. When
                  we do, we will update the &ldquo;Last updated&rdquo; date at
                  the top of this page. We encourage you to review these Terms
                  periodically to stay informed of any changes. Your continued
                  use of the site after any changes constitutes your acceptance
                  of the new Terms.
                </p>
              </TermsSection>

              {/* Section 9 */}
              <TermsSection
                id="contact"
                icon={<Mail className="h-5 w-5" />}
                title="Contact Us"
              >
                <p>
                  If you have questions or concerns about these Terms and
                  Conditions, please contact us at:
                </p>
                <div className="mt-4 bg-muted/40 border border-border/50 rounded-xl p-6">
                  <p className="font-heading font-bold text-foreground text-lg">
                    Shumaker Roofing
                  </p>
                  <p className="text-foreground/70 mt-1">
                    123 Roofing Way, Suite 100
                    <br />
                    Cityville, ST 12345
                  </p>
                  <p className="text-foreground/70 mt-2">
                    <a
                      href="mailto:info@shumakerroofing.com"
                      className="text-primary hover:underline"
                    >
                      info@shumakerroofing.com
                    </a>
                  </p>
                  <p className="text-foreground/70">+1 234 567 8900</p>
                </div>
              </TermsSection>

              {/* Footer Nav */}
              <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Also read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <Link
                  href="/contact"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Questions? Contact us &rarr;
                </Link>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </div>
  );
}

function TermsSection({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-8" aria-labelledby={`${id}-heading`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
          {icon}
        </div>
        <h2
          id={`${id}-heading`}
          className="text-xl md:text-2xl font-heading font-bold text-foreground"
        >
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-12 flex flex-col gap-3 text-foreground/70 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
