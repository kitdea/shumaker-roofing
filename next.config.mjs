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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
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
        destination: '/roof-for-heroes',
        permanent: true,
      },
      {
        source: '/roofs-for-heroes',
        destination: '/roof-for-heroes',
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
        source: '/roof-repair',
        destination: '/services/roof-repair',
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
        source: '/blog/the-7-main-parts-of-a-metal-roof',
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
    ];
  },
};

export default nextConfig;
