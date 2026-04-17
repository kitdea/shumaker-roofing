import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { fetchPageSeo } from "@/lib/seo";
import { Shield, Eye, Lock, Users, Cookie, Bell, Mail } from "lucide-react";

export async function generateMetadata() {
  return fetchPageSeo({
    path: "/privacy-policy",
    fallbackTitle: "Privacy Policy | Shumaker Roofing",
    fallbackDesc:
      "Read Shumaker Roofing's Privacy Policy to understand how we collect, use, and protect your personal information when you use our services.",
  });
}

const sections = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "information-sharing", label: "Information Sharing" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "data-security", label: "Data Security" },
  { id: "your-rights", label: "Your Rights" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
            alt="Privacy Policy"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect
            your personal information.
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
                  <nav aria-label="Privacy Policy sections">
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
            <article className="flex-1 min-w-0" aria-label="Privacy Policy content">
              {/* Intro */}
              <div className="mb-10">
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Shumaker Roofing (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                  &ldquo;us&rdquo;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you visit our website or
                  engage with our roofing services. Please read this policy
                  carefully. If you disagree with its terms, please discontinue
                  use of our site.
                </p>
              </div>

              {/* Section 1 */}
              <PolicySection
                id="information-we-collect"
                icon={<Eye className="h-5 w-5" />}
                title="Information We Collect"
              >
                <p>
                  We may collect information about you in a variety of ways,
                  including:
                </p>
                <PolicyList
                  items={[
                    {
                      heading: "Personal Data",
                      text: "Personally identifiable information such as your name, email address, phone number, and mailing address that you voluntarily provide when contacting us or requesting a quote.",
                    },
                    {
                      heading: "Derivative Data",
                      text: "Information our servers automatically collect when you visit our site, including your IP address, browser type, operating system, access times, and the pages you have viewed.",
                    },
                    {
                      heading: "Financial Data",
                      text: "Payment information such as your payment instrument number and the security code associated with your payment instrument, collected only when you engage our services.",
                    },
                  ]}
                />
              </PolicySection>

              {/* Section 2 */}
              <PolicySection
                id="how-we-use"
                icon={<Shield className="h-5 w-5" />}
                title="How We Use Your Information"
              >
                <p>
                  Having accurate information about you permits us to provide
                  you with a smooth, efficient, and customized experience.
                  Specifically, we may use information collected about you to:
                </p>
                <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-foreground/70">
                  {[
                    "Process and fulfill your service requests and transactions.",
                    "Send you administrative information such as confirmations and invoices.",
                    "Respond to customer service requests, questions, and concerns.",
                    "Send you marketing and promotional communications (with your consent).",
                    "Improve our website, products, and services.",
                    "Monitor and analyze usage and trends to improve your experience.",
                    "Comply with applicable legal obligations.",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </PolicySection>

              {/* Section 3 */}
              <PolicySection
                id="information-sharing"
                icon={<Users className="h-5 w-5" />}
                title="Information Sharing"
              >
                <p>
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except in
                  the following limited circumstances:
                </p>
                <PolicyList
                  items={[
                    {
                      heading: "Service Providers",
                      text: "We may share your information with third-party vendors and service providers that perform services on our behalf, such as payment processing, email delivery, and analytics.",
                    },
                    {
                      heading: "Legal Requirements",
                      text: "We may disclose your information where required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).",
                    },
                    {
                      heading: "Business Transfers",
                      text: "If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.",
                    },
                  ]}
                />
              </PolicySection>

              {/* Section 4 */}
              <PolicySection
                id="cookies"
                icon={<Cookie className="h-5 w-5" />}
                title="Cookies & Tracking Technologies"
              >
                <p>
                  We may use cookies, web beacons, tracking pixels, and other
                  tracking technologies on our website to help customize the
                  site and improve your experience. When you access our site,
                  your personal information is not collected through the use of
                  tracking technology.
                </p>
                <p className="mt-4">
                  Most browsers are set to accept cookies by default. You can
                  remove or reject cookies through your browser settings.
                  Please be aware that such action could affect the
                  availability and functionality of the site.
                </p>
              </PolicySection>

              {/* Section 5 */}
              <PolicySection
                id="data-security"
                icon={<Lock className="h-5 w-5" />}
                title="Data Security"
              >
                <p>
                  We use administrative, technical, and physical security
                  measures to help protect your personal information. While we
                  have taken reasonable steps to secure the personal
                  information you provide to us, please be aware that despite
                  our efforts, no security measures are perfect or
                  impenetrable, and no method of data transmission can be
                  guaranteed against any interception or other type of misuse.
                </p>
              </PolicySection>

              {/* Section 6 */}
              <PolicySection
                id="your-rights"
                icon={<Bell className="h-5 w-5" />}
                title="Your Rights"
              >
                <p>
                  Depending on your location, you may have certain rights
                  regarding your personal information, including:
                </p>
                <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-foreground/70">
                  {[
                    "The right to access the personal information we hold about you.",
                    "The right to request correction of inaccurate personal information.",
                    "The right to request deletion of your personal information.",
                    "The right to opt out of marketing communications at any time.",
                    "The right to data portability in certain circumstances.",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us using the
                  information provided below.
                </p>
              </PolicySection>

              {/* Section 7 */}
              <PolicySection
                id="contact"
                icon={<Mail className="h-5 w-5" />}
                title="Contact Us"
              >
                <p>
                  If you have questions or concerns about this Privacy Policy,
                  please contact us at:
                </p>
                <div className="mt-4 bg-muted/40 border border-border/50 rounded-xl p-6 not-prose">
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
              </PolicySection>

              {/* Footer Nav */}
              <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Also read our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms &amp; Conditions
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

function PolicySection({
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

function PolicyList({
  items,
}: {
  items: { heading: string; text: string }[];
}) {
  return (
    <ul className="flex flex-col gap-4 mt-2">
      {items.map((item) => (
        <li key={item.heading} className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">{item.heading}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
