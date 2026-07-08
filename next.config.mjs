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
    qualities: [60, 75, 85],
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
        source: '/commercial-roofers-frederick-md',
        destination: '/services/commercial-flat-low-slope-roofing-restoration',
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
        source: '/wp-content/uploads/2024/07/DIY-Vs.-Professional-Hiring-600x400.jpg',
        destination: '/',
        permanent: true,
      },
      {
        source: '/metal-roofs-screw-down-vs-standing-seam',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/metal-roofing-in-bethesda-md',
        destination: '/services',
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
      

    
      // Old service path
      {
        source: '/residential-services/skylights-and-suntunnels',
        destination: '/services/skylight-installation',
        permanent: true,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.clarity.ms https://cdn.callrail.com https://app.roofle.com https://link.msgsndr.com https://widgets.leadconnectorhq.com https://projectmapit.com https://veluxsolutions.com https://reputationhub.site",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com https://projectmapit.com https://reputationhub.site",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://ad.doubleclick.net https://googleads.g.doubleclick.net https://www.facebook.com https://www.clarity.ms https://*.clarity.ms https://cdn.callrail.com https://app.callrail.com https://app.roofle.com https://api.roofle.com https://projectmapit.com https://api.leadconnectorhq.com https://widgets.leadconnectorhq.com https://reputationhub.site",
      "frame-src 'self' https://www.facebook.com https://app.roofle.com https://api.leadconnectorhq.com https://widgets.leadconnectorhq.com https://www.youtube.com https://www.google.com https://veluxsolutions.com https://reputationhub.site",
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
