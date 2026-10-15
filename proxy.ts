import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy URLs whose content is permanently gone with no equivalent page to
 * redirect to (AUD-1005-01, "Window A"). These must answer 410 Gone — not 404,
 * not a redirect — so search engines drop them promptly instead of re-crawling
 * a soft 404 for months. URLs that DO have a sensible destination belong in the
 * `redirects()` list in next.config.mjs instead.
 */
const GONE_PATHS = new Set([
  "/the-ideal-roof-color-for-tropical-climates",
  "/roofing-nails-a-complete-guide-to-types",
]);

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

const GONE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page Removed | Shumaker Roofing</title>
<style>
  :root { color-scheme: light }
  body { margin:0; font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
         background:#fff; color:#1a1a1a; display:flex; align-items:center;
         justify-content:center; min-height:100vh; padding:2rem; }
  main { max-width:34rem; text-align:center }
  .code { font-size:2.25rem; font-weight:800; color:#b1261f; margin:0 0 .5rem }
  h1 { font-size:1.75rem; line-height:1.2; margin:0 0 1rem }
  p { color:#555; line-height:1.6; margin:0 0 1.75rem }
  nav { display:flex; flex-wrap:wrap; gap:.75rem; justify-content:center }
  a { display:inline-block; padding:.75rem 1.25rem; border-radius:.5rem;
      text-decoration:none; font-weight:700; font-size:.875rem;
      text-transform:uppercase; letter-spacing:.02em; }
  a.primary { background:#b1261f; color:#fff }
  a.secondary { border:1px solid #d4d4d4; color:#1a1a1a }
</style>
</head>
<body>
<main>
  <p class="code">410</p>
  <h1>This Page Has Been Removed</h1>
  <p>The page you requested is no longer part of our site and has not been replaced. Our current roofing services and service areas are below.</p>
  <nav>
    <a class="primary" href="/">Back to Home</a>
    <a class="secondary" href="/services">Our Services</a>
    <a class="secondary" href="/service-areas">Service Areas</a>
    <a class="secondary" href="/contact">Contact Us</a>
  </nav>
</main>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "www.shumakerroofing.com") {
    const url = request.nextUrl.clone();
    url.host = "shumakerroofing.com";
    return NextResponse.redirect(url, { status: 301 });
  }

  if (GONE_PATHS.has(normalizePath(request.nextUrl.pathname))) {
    return new NextResponse(GONE_PAGE, {
      status: 410,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-robots-tag": "noindex",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
