"use client";

import Script from "next/script";

export function ReviewWidget() {
  return (
    <>
      <Script
        src="https://reputationhub.site/reputation/assets/review-widget.js"
        strategy="lazyOnload"
      />
      <iframe
        className="lc_reviews_widget"
        src="https://reputationhub.site/reputation/widgets/review_widget/LNAOREJVLpmF21aOaeTw"
        frameBorder={0}
        scrolling="no"
        style={{ minWidth: "100%", width: "100%", border: 0 }}
        title="Shumaker Roofing Customer Reviews"
      />
    </>
  );
}
