import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve('.'),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cap at 1920 — removes 2048 & 3840 from default srcset,
    // avoiding unnecessarily large image downloads.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Every `quality={n}` used in the app must be listed here or the image 400s.
    qualities: [50, 60, 75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/appointment-calendar-book-now',
        destination: '/book-appointment',
        permanent: true,
      },
      {
        source: '/blog/maryland-roof-rejuvenation-contractor-frederick-md',
        destination: '/blog/what-is-roof-rejuvenation',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/book-appointment',
        permanent: true,
      },
      {
        source: '/schedule-now',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/meet-the-shumaker-roofing-team-frederick-md',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/view-projects',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/roof-for-heroes-shumaker-roofings-commitment-to-veterans',
        destination: '/roofs-for-heroes',
        permanent: true,
      },
      {
        source: '/roof-for-heroes',
        destination: '/roofs-for-heroes',
        permanent: true,
      },
      {
        source: '/location/roofers-in-reston-va',
        destination: '/service-areas/reston-va',
        permanent: true,
      },
      {
        source: '/location/roofers-in-frederick-md',
        destination: '/service-areas/frederick-md',
        permanent: true,
      },
      {
        source: '/location/roofers-in-hagerstown-md',
        destination: '/service-areas/hagerstown-md',
        permanent: true,
      },
      {
        source: '/roofers-in-hagerstown-md',
        destination: '/service-areas/hagerstown-md',
        permanent: true,
      },
      {
        source: '/location/roofers-in-chambersburg-pa',
        destination: '/service-areas/chambersburg-pa',
        permanent: true,
      },
      {
        source: '/roofers-frederick-md-faqs',
        destination: '/faqs',
        permanent: true,
      },
      {
        source: '/faq-items/is-your-contractor-licensed-insured',
        destination: '/faqs',
        permanent: true,
      },
      {
        source: '/roof-installation-in-frederick-md',
        destination: '/services/roof-installation',
        permanent: true,
      },
      {
        source: '/roof-installation',
        destination: '/services/roof-installation',
        permanent: true,
      },
      {
        source: '/roof-repair-in-frederick-md',
        destination: '/services/roof-repair',
        permanent: true,
      },
      {
        source: '/roof-replacement-frederick-md',
        destination: '/services/roof-replacement',
        permanent: true,
      },
      {
        source: '/roofing-company-in-frederick-md',
        destination: '/',
        permanent: true,
      },
      {
        source: '/roof-rejuvenation-in-frederick-md',
        destination: '/services/roof-rejuvenation',
        permanent: true,
      },
      {
        source: '/gutter-installation-frederick-md',
        destination: '/services/gutter-installation',
        permanent: true,
      },
      {
        source: '/residential-roofers-frederick-md',
        destination: '/services/residential-roofing',
        permanent: true,
      },
      {
        source: '/storm-damage-roofers-frederick-md',
        destination: '/services/storm-damage-restoration',
        permanent: true,
      },
      {
        source: '/local-roofers-in-hagerstown-md',
        destination: '/service-areas/hagerstown-md',
        permanent: true,
      },
      {
        source: '/roof-leak-repair-in-hagerstown-md',
        destination: '/service-areas/hagerstown-md',
        permanent: true,
      },
      {
        source: '/skylight-installation-in-hagerstown-md',
        destination: '/service-areas/hagerstown-md',
        permanent: true,
      },
      {
        source: '/top-roofing-in-hagerstown-md',
        destination: '/service-areas/hagerstown-md',
        permanent: true,
      },
      {
        source: '/reviews-testimonials',
        destination: '/testimonials',
        permanent: true,
      },
      {
        source: '/faq-items',
        destination: '/faqs',
        permanent: true,
      },
      {
        source: '/location',
        destination: '/service-areas',
        permanent: true,
      },
      {
        source: '/roofers-blog-frederick-md',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/roof-repair-in-hagerstown-md',
        destination: '/services/roof-repair',
        permanent: true,
      },
      {
        source: '/roof-repair-in-hagerstown-md',
        destination: '/services/roof-repair',
        permanent: true,
      },
      {
        source: '/roof-repair',
        destination: '/services/roof-repair',
        permanent: true,
      },
      {
        source: '/location/roofers-in-ijamsville-md',
        destination: '/service-areas/frederick-md',
        permanent: true,
      },
      {
        source: '/metal-roofing-in-bethesda-md',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/commercial-flat-low-slope-roofing-restoration',
        destination: '/services/commercial-flat-and-low-slope-roofing-restoration',
        permanent: true,
      },
      {
        source: '/commercial-roofers-frederick-md',
        destination: '/service-areas/frederick-md', 
        permanent: true,
      },
      // Leftover WordPress upload paths — no live route lives under /wp-content
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },

      // Blog posts previously linked without /blog/ prefix
      {
        source: '/do-commercial-silicone-roof-coatings-offer-tax-advantages',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/flat-roof-warranty-guide-for-frederick-md-homeowners',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-can-you-find-a-trustworthy-local-roofing-contractor',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/skylight-installation-a-step-by-step-guide',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/why-skylights-and-sun-tunnels-are-a-good-idea-for-your-home',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-does-roof-rejuvenation-improve-extend-your-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/is-roof-rejuvenation-the-cost-effective-solution-for-you',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-the-average-roof-replacement-cost-in-maryland',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/12-types-of-roof-materials-choosing-the-best-option',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-are-shingles-made-of',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/complete-guide-to-metal-roof-maintenance',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/complete-guide-to-metal-roof-maintenance',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/the-7-main-parts-of-a-metal-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/roof-rejuvenation-cost-guide-factors-estimates-explained',
        destination: '/blog/roof-rejuvenation-cost-frederick-md',
        permanent: true,
      },
      {
        source: '/roof-rejuvenation-cost-frederick-md',
        destination: '/blog/roof-rejuvenation-cost-frederick-md',
        permanent: true,
      },
      {
        source: '/metal-roofs-screw-down-vs-standing-seam',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-the-cost-of-installing-soffit-ridge-and-roof-vents',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/which-should-be-done-first-siding-windows-or-roofing',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md',
        destination: '/blog/how-marylands-summer-heat-affects-roofs-in-frederick-md',
        permanent: true,
      },
      {
        source: '/blog/common-winter-roof-damage-issues-and-how-to-prevent-them',
        destination: '/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them',
        permanent: true,
      },
      {
        source: '/blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice',
        destination: '/blog/best-roofing-contractors-in-frederick-md',
        permanent: true,
      },
      {
        source: '/blog/roof-repair-in-frederick-md-fast-reliable',
        destination: '/blog/roof-repair-frederick-md',
        permanent: true,
      },
      {
        source: '/blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know',
        destination: '/blog/roof-replacement-tax-credit-2026',
        permanent: true,
      },
      {
        source: '/blog/three-common-winter-roof-damage-issues-how-to-prevent-them',
        destination: '/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them',
        permanent: true, 
      },
      {
        source: '/category/uncategorized/page/16/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/roofers-blog-frederick-md/page/20',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-can-you-restore-your-roof-for-lasting-protection',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-happens-when-water-doesnt-drain-from-a-flat-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/flat-roof-damage-prevention-expert-tips-for-a-lasting-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/why-roof-maintenance-is-important-for-home-longevity',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/uncover-how-flat-roofs-drain-essential-tips-and-secrets',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/flat-roof-mold-prevention-essential-tips-for-protection',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-roof-restoration-process',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-long-does-a-roof-inspection-take',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/is-metal-shingle-roofing-the-best-choice-for-your-home',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/why-flat-roof-flashing-causes-most-flat-roof-leaks',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/roofers-blog-frederick-md/page/37',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/shingle-roofing-vs-flat-roofing-key-differences',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/5-reasons-your-roof-shingles-are-turning-black',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/flat-roof-problems-common-signs-how-to-prevent-them',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/the-4-reasons-roofing-contractors-keep-knocking-on-your-door',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-to-tarp-your-roof-after-a-storm-diy-or-pro-help',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/flat-roof-myths-debunked-what-you-really-need-to-know',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/energy-saving-benefits-of-installing-a-new-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/can-i-repair-the-roof-myself',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-type-of-roof-is-easiest-to-maintain',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/8-common-problems-of-metal-roofs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-to-clean-a-painted-metal-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-time-of-year-is-best-to-replace-a-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/the-brilliant-benefits-of-adding-a-skylight-or-sun-tunnel-to-your-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/13-proven-tips-to-choose-the-right-siding-contractor',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/uncategorized/page/38',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/the-most-common-problems-caused-by-poor-attic-ventilation',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/uncategorized/page/33',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-do-you-document-roof-storm-damage-for-insurance-claims',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/need-pro-shingle-replacement-contractors-quick-guide',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/certainteed-solar-panels-the-complete-review',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-roof-replacement',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/top-benefits-of-installing-a-skylight-in-your-home',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-to-fix-loose-siding',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/is-it-time-to-replace-your-homes-siding',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/permit-guide-for-roof-replacement-what-you-need-to-know',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/flat-roof-maintenance-keep-leaks-and-repairs-away',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-the-meaning-of-roof-restoration',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/your-expert-guide-to-roof-restoration',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-can-you-accurately-measure-your-home-siding',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/does-homeowners-insurance-cover-roof-replacement',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/roofers-blog-frederick-md/page/3',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-commercial-metal-coatings-protect-your-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/are-small-roof-leaks-common',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/roof-shingles-frederick-md-durable-stylish-affordable',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/re-roofing-vs-complete-roof-replacement',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-to-repair-granular-loss-on-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/does-a-house-need-gutters-to-pass-inspection',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-to-do-when-missing-shingles-on-your-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/top-roofing-problems-solutions-fix-your-roof-today',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/should-i-let-a-roofing-company-pay-my-deductible',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/are-gutters-a-good-investment-for-a-homeowner',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-much-do-skylights-cost-get-your-moneys-worth',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/best-roofing-options-for-energy-efficiency-top-choices',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-are-the-steps-of-installing-a-new-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-long-do-certainteed-landmark-shingles-last',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/faq-items/how-is-a-roof-replaced',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-your-roof-affects-your-home-insurance',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-much-attic-ventilation-do-i-need',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/uncategorized/page/22',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/siding-installation-mistakes-that-can-ruin-your-homes-look',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-do-i-know-if-my-roof-is-installed-correctly',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-proper-roof-maintenance',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/roofers-blog-frederick-md/page/38',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/5-reasons-specialist-roofers-surpass-general-contractors',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/should-you-install-a-new-roof-before-solar-panels',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/is-it-bad-to-have-too-much-attic-ventilation',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-to-know-when-to-replace-your-roof-in-2025',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-often-should-you-replace-a-metal-roof',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/how-much-does-it-cost-to-repair-siding',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/what-is-the-best-siding-to-use-on-a-house',
        destination: '/blog',
        permanent: true,
      },
      // Old service path
      {
        source: '/durability-of-metal-roofing',
        destination: '/services/metal-roofing',
        permanent: true,
      },
      {
        source: '/residential-services/skylights-and-suntunnels',
        destination: '/services/skylight-installation',
        permanent: true,
      },
      {
        source: '/commercial-flat-roof-repair-in-frederick-md',
        destination: '/services/commercial-flat-and-low-slope-roofing-restoration',
        permanent: true,
      },
      {
        source: '/best-eco-friendly-flat-roof-repair-solutions',
        destination: '/services/roof-repair',
        permanent: true,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.clarity.ms https://scripts.clarity.ms https://cdn.callrail.com https://js.callrail.com https://app.roofle.com https://link.msgsndr.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://services.leadconnectorhq.com https://backend.leadconnectorhq.com https://projectmapit.com https://veluxsolutions.com https://reputationhub.site",
      "style-src 'self' 'unsafe-inline' https://stcdn.leadconnectorhq.com https://fonts.bunny.net",
      "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com https://www.facebook.com https://*.google-analytics.com https://www.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://google.com https://pagead2.googlesyndication.com https://www.googleadservices.com https://c.clarity.ms https://c.bing.com https://projectmapit.com https://reputationhub.site https://widgets.leadconnectorhq.com https://assets.app.roofle.com https://app.roofle.com https://veluxsolutions.com",
      "font-src 'self' data: https://assets.app.roofle.com https://fonts.bunny.net",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://google.com https://pagead2.googlesyndication.com https://www.googleadservices.com https://ad.doubleclick.net https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.facebook.com https://www.clarity.ms https://*.clarity.ms https://cdn.callrail.com https://app.callrail.com https://app.roofle.com https://api.roofle.com https://api.app.roofle.com https://projectmapit.com https://api.leadconnectorhq.com https://widgets.leadconnectorhq.com https://services.leadconnectorhq.com wss://services.leadconnectorhq.com https://backend.leadconnectorhq.com https://services.msgsndr.com https://reputationhub.site",
      "frame-src 'self' https://www.googletagmanager.com https://www.facebook.com https://app.roofle.com https://api.leadconnectorhq.com https://widgets.leadconnectorhq.com https://www.youtube.com https://www.google.com https://veluxsolutions.com https://reputationhub.site https://projectmapit.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        // Exclude /studio — the embedded Sanity Studio needs broader
        // script/connect access than the public site's policy allows.
        source: '/((?!studio).*)',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },
};

export default nextConfig;
